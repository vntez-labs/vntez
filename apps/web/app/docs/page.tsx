import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  IconBook,
  IconTerminal2,
  IconCode,
  IconServer2,
  IconShieldCheck,
  IconRefresh,
  IconCopy,
  IconCheck,
  IconArrowRight,
  IconExternalLink,
} from "@tabler/icons-react"

export const metadata: Metadata = {
  title: "Tài liệu kỹ thuật — vntez Developer Hub",
  description:
    "Hướng dẫn tích hợp SDK chính thức, tài liệu API AWS S3 compatible, cấu hình OAuth 2.0 PKCE và giao thức đồng bộ Offline-First với SQLite.",
}

const SECTIONS = [
  {
    id: "quickstart",
    title: "1. Bắt đầu nhanh (Quickstart)",
    badge: "SDK V3.4",
    desc: "Cài đặt SDK chính thức của vntez và khởi tạo client trong chưa đầy 3 phút.",
    code: `// Cài đặt qua Bun, NPM hoặc PNPM
bun add @vntez/sdk
# hoặc
npm install @vntez/sdk

// Khởi tạo client trong mã nguồn (TypeScript)
import { vntez } from '@vntez/sdk';

const client = new vntez({
  appId: 'your_application_id',
  region: 'han-01', // 'han-01' (Hà Nội) hoặc 'sgn-02' (TP.HCM)
});`,
  },
  {
    id: "storage-api",
    title: "2. vntez Storage & Edge S3 API",
    badge: "S3 COMPATIBLE",
    desc: "Tải lên tệp đa phân mảnh (Multipart Upload), tạo Presigned URL và đồng bộ dữ liệu tới cụm NVMe.",
    code: `import { vntez } from '@vntez/sdk';

const client = new vntez({ appId: 'app_catalog' });

// Upload tệp lớn với cơ chế Multipart Upload tự động
const fileStream = fs.createReadStream('./dataset_backup.tar.gz');

const result = await client.storage.upload(fileStream, {
  bucket: 'production-assets',
  key: 'backups/2026/db_dump.tar.gz',
  multipart: true,
  partSizeMb: 10,
  onProgress: (p) => console.log(\`Đã tải lên: \${p.percent}%\`),
});

console.log('Public CDN URL:', result.url);`,
  },
  {
    id: "oauth-pkce",
    title: "3. vntez-id & OAuth 2.0 PKCE",
    badge: "RFC 7636",
    desc: "Luồng ủy quyền không mật khẩu tĩnh (Zero Static Secret) dành cho ứng dụng di động và Single Page App.",
    code: `import { vntezAuth } from '@vntez/sdk/auth';

// 1. Tạo cặp Code Verifier và Code Challenge S256
const { codeVerifier, codeChallenge } = await vntezAuth.generatePKCE();

// 2. Chuyển hướng người dùng tới cổng đăng nhập
const authUrl = vntezAuth.getAuthorizeUrl({
  clientId: 'client_mobile_pos',
  redirectUri: 'vntezpos://oauth/callback',
  codeChallenge,
  codeChallengeMethod: 'S256',
  scope: 'openid profile email pos.write',
});

// 3. Đổi Authorization Code lấy token an toàn
const session = await vntezAuth.exchangeCodeForToken({
  code: returnedCode,
  codeVerifier,
  clientId: 'client_mobile_pos',
});`,
  },
  {
    id: "offline-pos",
    title: "4. BMAN POS Offline Protocol & SQLite WAL",
    badge: "OFFLINE-FIRST",
    desc: "Cấu hình cơ sở dữ liệu SQLite cục bộ tại quầy thu ngân và thiết lập hàng đợi đối soát tự động.",
    code: `import { createPosDatabase, syncManager } from '@vntez/pos-core';

// Khởi tạo SQLite với chế độ Write-Ahead Log (WAL)
const db = await createPosDatabase({
  path: './data/bman_register.db',
  journalMode: 'WAL',
  synchronous: 'NORMAL',
});

// Ghi nhận đơn hàng ngoại tuyến trong 12ms
const order = await db.orders.create({
  items: [{ sku: 'CF-SUA-DA', qty: 2, price: 35000 }],
  paymentMethod: 'CASH',
  offlineSignedAt: new Date().toISOString(),
});

// Lắng nghe sự kiện kết nối mạng để tự động reconciliation
syncManager.on('online', async () => {
  const synced = await syncManager.flushQueue(db);
  console.log(\`Đã đối soát thành công \${synced.count} đơn hàng lên Cloud!\`);
});`,
  },
]

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="brand" className="font-mono uppercase tracking-wider text-xs px-3 py-1">
          VNTEZ DEVELOPER HUB
        </Badge>

        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Tài liệu kỹ thuật & <br />
          <span className="text-[#fb291a]">Hướng dẫn tích hợp SDK.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
          Mọi thứ bạn cần để kết nối ứng dụng với hạ tầng lưu trữ S3, định danh bảo mật OAuth 2.0 PKCE và kiến trúc bán lẻ Offline-First.
        </p>
      </div>

      {/* Quick Links Navigation Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e] px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-[#fb291a]/40 hover:text-[#fb291a] transition-all"
          >
            {s.title.split(". ")[1]}
          </a>
        ))}
      </div>

      {/* Documentation Content Sections */}
      <div className="space-y-12">
        {SECTIONS.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className="scroll-mt-28 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#0c121e] p-6 sm:p-8 space-y-5 shadow-sm"
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <IconCode className="size-5 text-[#fb291a]" />
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <Badge variant="brand" className="font-mono text-[11px] font-semibold">
                {section.badge}
              </Badge>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {section.desc}
            </p>

            {/* Code Block Container */}
            <div className="rounded-xl bg-[#080d16] border border-white/[0.08] p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-slate-200 overflow-x-auto">
              <pre className="whitespace-pre">{section.code}</pre>
            </div>
          </div>
        ))}
      </div>

      {/* Need Help Box */}
      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.06] bg-slate-50 dark:bg-[#070b14] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Cần hỗ trợ tích hợp hoặc tùy biến riêng?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Kỹ sư của VNTEZ sẵn sàng pair programming và rà soát kiến trúc cùng đội ngũ phát triển của bạn.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://github.com/hnamhocit"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({
              variant: "outline",
              size: "default",
              className: "rounded-xl font-semibold gap-2",
            })}
          >
            <span>GitHub @hnamhocit</span>
            <IconExternalLink className="size-4 text-slate-400" />
          </a>
          <a
            href="mailto:support@vntez.net"
            className={buttonVariants({
              variant: "default",
              size: "default",
              className: "rounded-xl font-semibold shadow-sm",
            })}
          >
            Liên hệ hỗ trợ
          </a>
        </div>
      </div>
    </div>
  )
}
