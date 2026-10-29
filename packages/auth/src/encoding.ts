/**
 * Vietnamese Text & Encoding Utilities
 * Resolves CP1252/Latin-1 double-decoding (mojibake) issues common in HTTP headers & cookies.
 */

const CP1252_BYTE_MAP: Record<number, number> = {
  0x20ac: 0x80,
  0x201a: 0x82,
  0x0192: 0x83,
  0x201e: 0x84,
  0x2026: 0x85,
  0x2020: 0x86,
  0x2021: 0x87,
  0x02c6: 0x88,
  0x2030: 0x89,
  0x0160: 0x8a,
  0x2039: 0x8b,
  0x0152: 0x8c,
  0x017d: 0x8e,
  0x2018: 0x91,
  0x2019: 0x92,
  0x201c: 0x93,
  0x201d: 0x94,
  0x2022: 0x95,
  0x2013: 0x96,
  0x2014: 0x97,
  0x02dc: 0x98,
  0x2122: 0x99,
  0x0161: 0x9a,
  0x203a: 0x9b,
  0x0153: 0x9c,
  0x017e: 0x9e,
  0x0178: 0x9f,
};

/**
 * Automatically detects and repairs Latin-1 / Windows-1252 mojibake in Vietnamese text.
 * e.g. "Nam Nguyá»…n" -> "Nam Nguyễn"
 */
export function fixVietnameseEncoding(str?: string | null): string {
  if (!str) return '';

  // Quick check: if string doesn't contain typical mojibake indicator characters, return as-is
  if (!/[\u00c0-\u00ff\u2026]/.test(str)) {
    return str;
  }

  try {
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code in CP1252_BYTE_MAP) {
        bytes.push(CP1252_BYTE_MAP[code]!);
      } else if (code <= 0xff) {
        bytes.push(code);
      } else {
        // Character outside 0-255 range and not in CP1252 table, return original string
        return str;
      }
    }

    const decoded = Buffer.from(bytes).toString('utf-8');
    // If decoding succeeded without replacement character U+FFFD, return repaired string
    if (!decoded.includes('\ufffd')) {
      return decoded;
    }
  } catch {}

  return str;
}
