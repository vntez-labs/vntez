import crypto from "crypto";

/**
 * Mã hóa chuỗi Buffer thành Base64URL không có padding
 */
export function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Sinh cặp PKCE (Code Verifier & Code Challenge) dùng cho Tester / App vệ tinh
 */
export function generatePkcePair() {
  const verifier = base64UrlEncode(crypto.randomBytes(32));
  const challenge = crypto
    .createHash("sha256")
    .update(verifier)
    .digest("base64url");

  return {
    codeVerifier: verifier,
    codeChallenge: challenge,
    method: "S256" as const,
  };
}

/**
 * Kiểm tra tính hợp lệ của PKCE Code Verifier đối chiếu với Code Challenge
 */
export function verifyPkce(
  verifier: string,
  challenge: string,
  method = "S256",
): boolean {
  if (!verifier || !challenge) return false;

  if (method === "plain") {
    return verifier === challenge;
  }

  if (method === "S256") {
    const computed = crypto
      .createHash("sha256")
      .update(verifier)
      .digest("base64url");

    return computed === challenge;
  }

  return false;
}
