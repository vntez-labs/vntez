"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpDown,
  Check,
  ChevronDown,
  Code2,
  Coffee,
  Cpu,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  Grid as GridIcon,
  Image as ImageIcon,
  LogOut,
  Monitor,
  Pencil,
  Pin,
  PinOff,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Sparkles,
  Trash,
  Undo2,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ModeToggle } from "@/components/ThemeToggle";
import {
  addUserApp,
  deleteUserApp,
  type SystemApp,
  type UserApp,
  updateUserApp,
} from "@/lib/app-actions";
import { signOut } from "@/lib/auth-actions";

/* ================= TYPES ================= */
type MappedUser = {
  name: string;
  email: string;
  avatar: string | null;
  provider: string;
  role?: string;
};
type Zone = "desktop" | "dock";

type AppNode = {
  id: string;
  kind: "app";
  name: string;
  url: string;
  icon?: string;
  emoji?: string;
  gradient?: string;
  disabled?: boolean;
  src?: string;
  isSystem?: boolean;
  isPinned?: boolean;
  dockOrder?: number;
  gridCol?: number | null;
  gridRow?: number | null;
};

type FileNode = {
  id: string;
  kind: "file";
  name: string;
  content: string;
  fileType?: "txt" | "md";
  updatedAt?: number;
  src?: string;
};

type FolderNode = {
  id: string;
  kind: "folder";
  name: string;
  children: (AppNode | FileNode)[];
  src?: string;
};

type Node = AppNode | FileNode | FolderNode;
type Layout = { desktop: Node[]; dock: Node[] };
type TrashItem = { id: string; node: Node; origin: Zone; deletedAt: number };
type Toast = {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

type SlotPos = { col: number; row: number };
type PosMap = Record<string, SlotPos>; // nodeId -> { col, row }

type WallpaperKey = "aurora" | "sequoia" | "ocean" | "minimal";

/* ================= GRID CONSTANTS ================= */
const CELL_W = 96;
const CELL_H = 104;
const PAD_X = 20;
const PAD_Y = 16;

const DEFAULT_POSITIONS: PosMap = {
  "sys-mypc": { col: 0, row: 0 },
  "sys-trash": { col: 0, row: 1 },
  "welcome-file": { col: 0, row: 2 },
};

/* ================= WALLPAPER THEMES ================= */
const WALLPAPERS: Record<
  WallpaperKey,
  {
    name: string;
    desc: string;
    lightBg: string;
    lightBlobs: string[];
    darkBg: string;
    darkBlobs: string[];
  }
> = {
  aurora: {
    name: "Tím Ánh Cực Quang",
    desc: "Sắc tím đặc trưng VNTEZ hòa quyện ánh cyan",
    lightBg: "from-[#f5f3ff] via-[#eef2ff] to-[#f8fafc]",
    lightBlobs: [
      "bg-purple-400/20 -left-[10%] -top-[15%] h-[750px] w-[750px] blur-[140px]",
      "bg-sky-400/20 -right-[10%] bottom-[-10%] h-[650px] w-[650px] blur-[130px]",
    ],
    darkBg: "from-[#0c0915] via-[#0d1424] to-[#0a1830]",
    darkBlobs: [
      "bg-primary/25 -left-[10%] -top-[15%] h-[700px] w-[700px] blur-[140px]",
      "bg-info/20 -right-[10%] bottom-[-10%] h-[600px] w-[600px] blur-[130px]",
    ],
  },
  sequoia: {
    name: "Bình Minh Sequoia",
    desc: "Ấm áp ánh cam san hô và hồng đào",
    lightBg: "from-[#fff7ed] via-[#fef2f2] to-[#eff6ff]",
    lightBlobs: [
      "bg-amber-300/25 -left-[10%] -top-[15%] h-[750px] w-[750px] blur-[140px]",
      "bg-rose-400/20 -right-[10%] bottom-[-10%] h-[650px] w-[650px] blur-[130px]",
    ],
    darkBg: "from-[#1a0f1e] via-[#24132b] to-[#0f172a]",
    darkBlobs: [
      "bg-rose-500/25 -left-[10%] -top-[15%] h-[700px] w-[700px] blur-[140px]",
      "bg-amber-500/20 -right-[10%] bottom-[-10%] h-[600px] w-[600px] blur-[130px]",
    ],
  },
  ocean: {
    name: "Biển Ngọc Lagoon",
    desc: "Thanh mát với sắc xanh ngọc bích",
    lightBg: "from-[#f0fdfa] via-[#e0f2fe] to-[#f0f9ff]",
    lightBlobs: [
      "bg-teal-300/25 -left-[10%] -top-[15%] h-[750px] w-[750px] blur-[140px]",
      "bg-cyan-400/20 -right-[10%] bottom-[-10%] h-[650px] w-[650px] blur-[130px]",
    ],
    darkBg: "from-[#041421] via-[#071f30] to-[#09152b]",
    darkBlobs: [
      "bg-cyan-500/25 -left-[10%] -top-[15%] h-[700px] w-[700px] blur-[140px]",
      "bg-emerald-500/20 -right-[10%] bottom-[-10%] h-[600px] w-[600px] blur-[130px]",
    ],
  },
  minimal: {
    name: "Tối Giản Hiện Đại",
    desc: "Đơn sắc tinh khôi, sạch sẽ và tập trung",
    lightBg: "from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]",
    lightBlobs: [
      "bg-slate-300/40 -left-[10%] -top-[15%] h-[750px] w-[750px] blur-[140px]",
      "bg-slate-200/50 -right-[10%] bottom-[-10%] h-[650px] w-[650px] blur-[130px]",
    ],
    darkBg: "from-[#09090b] via-[#121215] to-[#18181b]",
    darkBlobs: [
      "bg-violet-900/15 -left-[10%] -top-[15%] h-[700px] w-[700px] blur-[140px]",
      "bg-zinc-800/30 -right-[10%] bottom-[-10%] h-[600px] w-[600px] blur-[130px]",
    ],
  },
};

/* ================= SOUND SYNTHESIZER ================= */
function playUiSound(
  type: "pop" | "trash" | "restore" | "click",
  enabled = true,
) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === "trash") {
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.16);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === "restore") {
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.18);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === "pop") {
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else {
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch {
    /* ignore audio error */
  }
}

const fav = (host: string) =>
  `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
const hostOf = (u: string) => {
  try {
    return new URL(u).hostname;
  } catch {
    return "";
  }
};
let _idCounter = 0;
const uid = () => globalThis.crypto?.randomUUID?.() ?? `id-${++_idCounter}`;
const isUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};
const launch = (n: AppNode) => {
  if (!n.disabled && n.url && n.url !== "#")
    window.open(n.url, "_blank", "noopener,noreferrer");
};
const srcOf = (n: Node) => n.src ?? n.id;

const mk = (
  id: string,
  name: string,
  url: string,
  emoji: string,
  gradient: string,
  disabled = false,
): AppNode => ({
  id,
  kind: "app",
  name,
  url,
  icon: fav(hostOf(url)),
  emoji,
  gradient,
  disabled,
  src: id,
});

/* ================= SEED DATA ================= */
const WELCOME_TXT = `Chào mừng bạn đến với VNTEZ Desktop! 🚀
----------------------------------------
Màn hình làm việc trực quan mô phỏng hệ điều hành với đầy đủ tính năng:

1. 🧭 Lưới căn chỉnh (Grid System):
   - Kéo thả tự do bất kỳ biểu tượng nào vào vị trí ngẫu nhiên trên màn hình
   - Xếp thành cột dọc (hàng dọc) hoặc hàng ngang tùy ý
   - Bật / tắt lưới căn chỉnh từ Menubar hoặc menu chuột phải

2. 🚀 OAuth 2.0 Identity Provider & Developer Hub:
   - Quản lý ứng dụng Client, tạo Client ID & Secret
   - Trình kiểm thử OAuth 2.0 PKCE trực quan tại /developers
   - Tích hợp đăng nhập một lần (SSO) an toàn cho toàn bộ hệ sinh thái

3. 🗑️ Thùng rác thông minh:
   - Kéo thả bất kỳ Ứng dụng, Tệp tin hoặc Thư mục vào Thùng rác để xóa
   - Hiển thị badge số lượng mục trong thùng rác
   - Chuột phải vào Thùng rác để Khôi phục mục vừa xóa hoặc Dọn sạch

4. 🖱️ Menu chuột phải:
   - Tạo tệp ghi chú mới (.txt)
   - Tạo thư mục mới
   - Sắp xếp nhanh thành 1 cột dọc hoặc 1 hàng ngang

5. 📄 Trình soạn thảo văn bản:
   - Nhấp đúp vào tệp tin để đọc & chỉnh sửa trực tiếp
   - Lưu trữ và tải tệp về máy tính (.txt)

6. 🌓 Giao diện thích ứng (Light & Dark Mode):
   - Trải nghiệm giao diện Sáng tinh tế và Tối huyền ảo đồng bộ với hệ thống.

Chúc bạn có một ngày làm việc hiệu quả!`;

export const FALLBACK_SYSTEM_APPS: SystemApp[] = [
  {
    id: "sys-dev-hub",
    name: "Developer Hub",
    url: "/developers",
    icon_url: null,
    is_pinned: true,
    dock_order: 0,
    grid_col: 0,
    grid_row: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "sys-oauth-tester",
    name: "OAuth Tester",
    url: "/developers",
    icon_url: null,
    is_pinned: true,
    dock_order: 1,
    grid_col: null,
    grid_row: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "sys-pomoduo",
    name: "Pomoduo",
    url: "https://pomoduo.vntez.cloud",
    icon_url: null,
    is_pinned: true,
    dock_order: 2,
    grid_col: null,
    grid_row: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "sys-bonsai",
    name: "Bonsai Reader",
    url: "https://bonsai-reader.vntez.cloud",
    icon_url: null,
    is_pinned: true,
    dock_order: 3,
    grid_col: null,
    grid_row: null,
    created_at: new Date().toISOString(),
  },
];

export const SYS_MYPC_NODE: AppNode = {
  id: "sys-mypc",
  src: "sys-mypc",
  kind: "app",
  name: "Máy của tôi",
  url: "#",
  icon: "",
  emoji: "🖥️",
  gradient: "from-sky-500 to-blue-600",
  disabled: false,
  isSystem: true,
  isPinned: true,
  dockOrder: 0,
};

export const SYS_TRASH_NODE: AppNode = {
  id: "sys-trash",
  src: "sys-trash",
  kind: "app",
  name: "Thùng rác",
  url: "#",
  icon: "",
  emoji: "🗑️",
  gradient: "from-rose-500 to-pink-600",
  disabled: false,
  isSystem: true,
  isPinned: true,
  dockOrder: 999,
};

export function mapSystemAppToNode(app: SystemApp): AppNode {
  const host = hostOf(app.url);
  let emoji = "⚡";
  let gradient = "from-violet-500 to-indigo-600";
  const disabled = false;

  if (app.url.includes("pomoduo")) {
    emoji = "⏱️";
    gradient = "from-violet-500 to-fuchsia-600";
  } else if (app.url.includes("bonsai")) {
    emoji = "📚";
    gradient = "from-emerald-500 to-teal-600";
  } else if (app.url.includes("solotype")) {
    emoji = "⌨️";
    gradient = "from-amber-500 to-orange-600";
  } else if (
    app.url.includes("vntez") ||
    app.name.toLowerCase().includes("vntez") ||
    app.url.includes("developers")
  ) {
    emoji = "🪐";
    gradient = "from-sky-500 to-indigo-600";
  }

  const cleanId = app.id || app.name.toLowerCase().replace(/\s+/g, "-");
  return {
    id: cleanId,
    src: cleanId,
    kind: "app",
    name: app.name,
    url: app.url,
    icon: app.icon_url || fav(host),
    emoji,
    gradient,
    disabled,
    isSystem: true,
    isPinned: Boolean(app.is_pinned),
    dockOrder: app.dock_order ?? 0,
    gridCol: app.grid_col,
    gridRow: app.grid_row,
  };
}

export function mapUserAppToNode(app: UserApp): AppNode {
  const host = hostOf(app.url);
  return {
    id: app.id,
    src: app.id,
    kind: "app",
    name: app.name,
    url: app.url,
    icon: app.icon_url || fav(host),
    emoji: "🔗",
    gradient: "from-zinc-500 to-zinc-700",
    disabled: false,
    isSystem: false,
    isPinned: Boolean(app.is_pinned),
    dockOrder: app.dock_order ?? 0,
    gridCol: app.grid_col,
    gridRow: app.grid_row,
  };
}

export function buildLayoutFromApps(
  systemApps: SystemApp[] = [],
  userApps: UserApp[] = [],
): { layout: Layout; initialPosMap: PosMap } {
  // Pinned mặc định trên Dock: PC ở đầu (order: 0), Thùng rác ở cuối (order: 999)
  const dockItems: { order: number; node: AppNode }[] = [
    { order: 0, node: SYS_MYPC_NODE },
    { order: 999, node: SYS_TRASH_NODE },
  ];
  const deskApps: AppNode[] = [];
  const initialPosMap: PosMap = {
    "sys-mypc": { col: 0, row: 0 },
    "sys-trash": { col: 0, row: 1 },
    "welcome-file": { col: 0, row: 2 },
  };

  // Hàm tự động phân bổ ô trống tiếp theo trên Desktop (quét cột dọc)
  const allocateSlot = (currentPosMap: PosMap): SlotPos => {
    const occupied = new Set(
      Object.values(currentPosMap).map((p) => `${p.col}-${p.row}`),
    );
    for (let c = 0; c < 20; c++) {
      for (let r = 0; r < 8; r++) {
        if (!occupied.has(`${c}-${r}`)) return { col: c, row: r };
      }
    }
    return { col: 0, row: 8 };
  };

  // 1. Phân loại System Apps - Lấy 100% từ bảng system_apps trong Supabase
  systemApps.forEach((app) => {
    const node = mapSystemAppToNode(app);
    if (app.is_pinned) {
      dockItems.push({ order: app.dock_order ?? 10, node });
    }
    deskApps.push(node);
    if (app.grid_col !== null && app.grid_row !== null) {
      initialPosMap[node.id] = { col: app.grid_col, row: app.grid_row };
    } else {
      initialPosMap[node.id] = allocateSlot(initialPosMap);
    }
  });

  // 2. Phân loại User Apps - Luôn xuất hiện trên màn hình Desktop
  userApps.forEach((app) => {
    const node = mapUserAppToNode(app);
    if (app.is_pinned) {
      dockItems.push({ order: (app.dock_order ?? 0) + 100, node });
    }
    deskApps.push(node);
    if (app.grid_col !== null && app.grid_row !== null) {
      initialPosMap[node.id] = { col: app.grid_col, row: app.grid_row };
    } else {
      initialPosMap[node.id] = allocateSlot(initialPosMap);
    }
  });

  // Sắp xếp Dock theo dock_order
  dockItems.sort((a, b) => a.order - b.order);
  const dockApps = dockItems.map((d) => d.node);

  const welcomeFile: FileNode = {
    id: "welcome-file",
    src: "welcome-file",
    kind: "file",
    name: "Chào mừng.txt",
    content: WELCOME_TXT,
    fileType: "txt",
    updatedAt: 1735689600000,
  };

  return {
    layout: {
      dock: dockApps,
      desktop: [...deskApps, welcomeFile],
    },
    initialPosMap,
  };
}

const WALLPAPER_KEY = "vntez.wallpaper.v1";
const SOUND_KEY = "vntez.sound.v1";
const POS_KEY = "vntez.desktop.grid.v6";

function allApps(l: Layout): AppNode[] {
  const out: AppNode[] = [];
  const walk = (arr: Node[]) =>
    arr.forEach((n) => {
      if (n.kind === "app") out.push(n);
      else if (n.kind === "folder")
        n.children.forEach((c) => {
          if (c.kind === "app") out.push(c);
        });
    });
  walk(l.desktop);
  walk(l.dock);
  return out;
}

const urlTaken = (l: Layout, url: string, exceptSrc?: string) =>
  allApps(l).some((a) => a.url === url && srcOf(a) !== exceptSrc);

const clonePin = (n: Node): Node => {
  if (n.kind === "app") {
    return {
      ...n,
      id: uid(),
      src: srcOf(n),
      isSystem: n.isSystem,
      isPinned: n.isPinned,
      dockOrder: n.dockOrder,
      gridCol: n.gridCol,
      gridRow: n.gridRow,
    };
  }
  if (n.kind === "file") return { ...n, id: uid(), src: srcOf(n) };
  return {
    ...n,
    id: uid(),
    src: srcOf(n),
    children: n.children.map((c) => ({ ...c, id: uid(), src: srcOf(c) })),
  };
};

function findTop(l: Layout, id: string) {
  for (const z of ["desktop", "dock"] as Zone[]) {
    const i = l[z].findIndex((n) => n.id === id);
    if (i >= 0) return { z, i };
  }
  return null;
}

function purgeSrc(l: Layout, src: string): Layout {
  const stripTop = (arr: Node[]) => arr.filter((n) => srcOf(n) !== src);
  const stripFolder = (arr: Node[]) =>
    arr.map((n) =>
      n.kind === "folder"
        ? { ...n, children: n.children.filter((c) => srcOf(c) !== src) }
        : n,
    );
  const dissolve = (arr: Node[]): Node[] => {
    const res: Node[] = [];
    for (const n of arr) {
      if (n.kind === "folder") {
        if (n.children.length >= 1) res.push(n);
      } else res.push(n);
    }
    return res;
  };
  return {
    desktop: dissolve(stripFolder(stripTop(l.desktop))),
    dock: dissolve(stripFolder(stripTop(l.dock))),
  };
}

function detachFromFolder(
  l0: Layout,
  folderId: string,
  itemId: string,
  zone: Zone,
): Layout {
  const l: Layout = { desktop: [...l0.desktop], dock: [...l0.dock] };
  const f = l[zone].find((n) => n.id === folderId) as FolderNode | undefined;
  if (!f || f.kind !== "folder") return l0;
  const item = f.children.find((c) => c.id === itemId);
  if (!item) return l0;
  const rest = f.children.filter((c) => c.id !== itemId);
  l[zone] = l[zone].filter((n) => n.id !== folderId);
  if (rest.length > 0) l[zone] = [...l[zone], { ...f, children: rest }, item];
  else l[zone] = [...l[zone], item];
  return l;
}

/* ================= GLYPHS ================= */
function Glyph({ app, small }: { app: AppNode; small?: boolean }) {
  const [broken, setBroken] = useState(false);
  const dim = app.disabled ? "opacity-45 grayscale" : "";
  const r = small ? "rounded-[20%]" : "rounded-[22%]";
  const showImg = app.icon && !broken;
  return showImg ? (
    <img
      src={app.icon}
      alt=""
      draggable={false}
      onError={() => setBroken(true)}
      className={`h-full w-full bg-white object-contain p-[10%] shadow-md shadow-black/20 ${r} ${dim}`}
    />
  ) : (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br shadow-md shadow-black/20 ${r} ${app.gradient} ${dim}`}
    >
      <span
        className="select-none leading-none"
        style={{ fontSize: small ? "48%" : "54%" }}
      >
        {app.emoji}
      </span>
    </div>
  );
}

function FileGlyph({ file }: { file: FileNode }) {
  return (
    <div className="relative h-full w-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <defs>
          <linearGradient id="pageGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <linearGradient id="foldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <path
          d="M 22 14 H 58 L 78 34 V 86 Q 78 90 74 90 H 26 Q 22 90 22 86 Z"
          fill="url(#pageGrad)"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />
        <path d="M 58 14 V 34 H 78 Z" fill="url(#foldGrad)" opacity="0.8" />
        <line
          x1="32"
          y1="44"
          x2="68"
          y2="44"
          stroke="#94a3b8"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        <line
          x1="32"
          y1="54"
          x2="68"
          y2="54"
          stroke="#94a3b8"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        <line
          x1="32"
          y1="64"
          x2="54"
          y2="64"
          stroke="#94a3b8"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
        <rect x="28" y="73" width="28" height="12" rx="3" fill="#8b5cf6" />
        <text
          x="42"
          y="82"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="8"
          fontWeight="bold"
          fontFamily="monospace"
        >
          TXT
        </text>
      </svg>
    </div>
  );
}

function FolderGlyph({ folder }: { folder: FolderNode }) {
  const inside = folder.children.slice(0, 2);
  return (
    <div className="relative h-full w-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd76a" />
            <stop offset="1" stopColor="#f5a623" />
          </linearGradient>
          <linearGradient id="fgt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe79a" />
            <stop offset="1" stopColor="#ffc24d" />
          </linearGradient>
        </defs>
        <path
          d="M8 30 q0-8 8-8 h22 l8 8 h38 q8 0 8 8 v6 H8 Z"
          fill="url(#fgt)"
        />
        {inside.map((c, i) => (
          <foreignObject
            key={c.id}
            x={i === 0 ? 20 : 44}
            y={34}
            width="34"
            height="34"
          >
            <div className="h-full w-full">
              {c.kind === "file" ? (
                <FileGlyph file={c} />
              ) : (
                <Glyph app={c} small />
              )}
            </div>
          </foreignObject>
        ))}
        <path
          d="M8 44 q0-6 6-6 h72 q6 0 6 6 v34 q0 8-8 8 H16 q-8 0-8-8 Z"
          fill="url(#fg)"
          opacity="0.97"
        />
        <path
          d="M8 44 q0-6 6-6 h72 q6 0 6 6"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

/* ================= SYSTEM ICONS ================= */
function SysIcon({
  emoji,
  label,
  selected,
  onClick,
  onContextMenu,
}: {
  emoji: string;
  label: string;
  selected?: boolean;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={`group flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-xl p-2 text-center transition-all focus:outline-none ${
        selected
          ? "bg-primary/20 ring-1 ring-primary/45 shadow-sm"
          : "hover:bg-black/5 dark:hover:bg-white/10"
      }`}
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="select-none text-[40px] leading-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-105">
          {emoji}
        </span>
      </div>
      <span className="line-clamp-2 text-[11px] font-medium leading-tight text-slate-800 dark:text-white/95 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
        {label}
      </span>
    </button>
  );
}

function TrashSysIcon({
  badge,
  isOver,
  selected,
  onClick,
  onContextMenu,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  badge: number;
  isOver: boolean;
  selected?: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onContextMenu={onContextMenu}
      onClick={onClick}
      className={`group relative flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-xl p-2 text-center transition-all cursor-pointer ${
        isOver
          ? "scale-110 bg-rose-500/20 ring-2 ring-rose-500 shadow-[0_0_24px_rgba(244,63,94,0.4)]"
          : selected
            ? "bg-primary/20 ring-1 ring-primary/45 shadow-sm"
            : "hover:bg-black/5 dark:hover:bg-white/10"
      }`}
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <motion.span
          animate={
            isOver
              ? { scale: [1, 1.25, 1.15], rotate: [-8, 8, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.3 }}
          className="select-none text-[42px] leading-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-transform group-hover:scale-105"
        >
          🗑️
        </motion.span>
        {badge > 0 && (
          <motion.span
            key={badge}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.35, 1] }}
            transition={{ type: "spring", stiffness: 450, damping: 20 }}
            className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white shadow-md ring-2 ring-white dark:ring-[#15101f]"
          >
            {badge}
          </motion.span>
        )}
      </div>
      <span className="line-clamp-2 text-[11px] font-medium leading-tight text-slate-800 dark:text-white/95 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
        {isOver ? "Thả để xóa" : "Thùng rác"}
      </span>
    </div>
  );
}

/* ================= DESKTOP ICON ================= */
function DesktopIcon({
  node,
  selected,
  renaming,
  renameVal,
  setRenameVal,
  commitRename,
  onSelect,
  onDragStart,
  onDragEnd,
  onDropNode,
  onCtx,
  onOpenFolder,
  onOpenFile,
}: {
  node: Node;
  selected: boolean;
  renaming: boolean;
  renameVal: string;
  setRenameVal: (v: string) => void;
  commitRename: () => void;
  onSelect: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onDropNode: (e: React.DragEvent, targetId: string) => void;
  onCtx: (e: React.MouseEvent, node: Node) => void;
  onOpenFolder: (id: string) => void;
  onOpenFile: (file: FileNode) => void;
}) {
  const isFolder = node.kind === "folder";
  const isFile = node.kind === "file";

  return (
    <div
      draggable={!renaming}
      onDragStart={(e) => !renaming && onDragStart(e, node.id)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDropNode(e, node.id);
      }}
      onContextMenu={(e) => {
        onSelect(node.id);
        onCtx(e, node);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id);
      }}
      onDoubleClick={() => {
        if (isFolder) onOpenFolder(node.id);
        else if (isFile) onOpenFile(node as FileNode);
        else launch(node as AppNode);
      }}
      className={`group flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-xl p-2 text-center transition-all ${
        selected
          ? "bg-primary/20 ring-1 ring-primary/45 shadow-sm"
          : "hover:bg-black/5 dark:hover:bg-white/10"
      } ${renaming ? "" : "cursor-pointer"}`}
    >
      <div className="h-14 w-14">
        {isFolder ? (
          <FolderGlyph folder={node as FolderNode} />
        ) : isFile ? (
          <FileGlyph file={node as FileNode} />
        ) : (
          <Glyph app={node as AppNode} />
        )}
      </div>
      {renaming ? (
        <input
          autoFocus
          value={renameVal}
          onChange={(e) => setRenameVal(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") commitRename();
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-full rounded-md border border-primary/60 bg-white/90 px-1 text-center text-[11px] text-slate-900 shadow-sm focus:outline-none dark:bg-black/80 dark:text-white"
        />
      ) : (
        <span className="line-clamp-2 text-[11px] font-medium leading-tight text-slate-800 dark:text-white/95 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
          {node.name}
        </span>
      )}
    </div>
  );
}

/* ================= CUSTOM DOCK SYSTEM ICONS ================= */
function MyPcDockIcon() {
  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-[22%] bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600 p-[12%] shadow-lg shadow-blue-500/25 ring-1 ring-white/40 overflow-hidden">
      {/* Specular gloss top reflection */}
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent pointer-events-none rounded-t-[22%]" />

      {/* Crisp vector desktop iMac screen */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]"
      >
        <defs>
          <linearGradient id="pcScreen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="pcStand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        {/* Monitor Frame */}
        <rect
          x="10"
          y="10"
          width="80"
          height="56"
          rx="8"
          fill="#1e293b"
          stroke="#cbd5e1"
          strokeWidth="2.5"
        />
        {/* Inner Screen */}
        <rect
          x="14"
          y="14"
          width="72"
          height="44"
          rx="4"
          fill="url(#pcScreen)"
        />
        {/* Screen wallpaper art */}
        <circle cx="64" cy="26" r="8" fill="#fde047" opacity="0.9" />
        <path d="M 20 54 Q 38 32 54 54 Z" fill="#6366f1" opacity="0.8" />
        <path d="M 44 54 Q 60 38 80 54 Z" fill="#4338ca" opacity="0.85" />
        {/* Camera dot */}
        <circle cx="50" cy="12" r="1.5" fill="#64748b" />
        {/* Stand Neck */}
        <path d="M 44 66 L 41 82 H 59 L 56 66 Z" fill="url(#pcStand)" />
        {/* Stand Base */}
        <rect x="30" y="82" width="40" height="5" rx="2.5" fill="#cbd5e1" />
      </svg>
    </div>
  );
}

function TrashDockIcon({ isFull }: { isFull: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center rounded-[22%] bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 dark:from-zinc-800 dark:via-zinc-900 dark:to-black p-[12%] shadow-lg shadow-black/20 ring-1 ring-white/40 dark:ring-white/10 overflow-hidden">
      {/* Specular gloss top reflection */}
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent pointer-events-none rounded-t-[22%]" />

      {/* Wastebasket vector */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]"
      >
        <defs>
          <linearGradient id="canBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="25%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="75%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="canRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {isFull && (
          // Crumpled paper poking out
          <g>
            <circle
              cx="42"
              cy="22"
              r="10"
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth="1"
            />
            <circle
              cx="58"
              cy="20"
              r="9"
              fill="#fef08a"
              stroke="#facc15"
              strokeWidth="1"
            />
            <circle
              cx="50"
              cy="25"
              r="8"
              fill="#bae6fd"
              stroke="#38bdf8"
              strokeWidth="1"
            />
            <path d="M 40 20 L 46 12 L 52 20 Z" fill="#ffffff" />
          </g>
        )}

        {/* Can Upper Rim */}
        <ellipse
          cx="50"
          cy="30"
          rx="32"
          ry="7"
          fill="url(#canRim)"
          stroke="#64748b"
          strokeWidth="1.5"
        />
        {/* Can Inner Depth */}
        <ellipse cx="50" cy="30" rx="28" ry="5" fill="#334155" />

        {/* Can Body */}
        <path
          d="M 20 30 L 29 86 Q 30 90 35 90 H 65 Q 70 90 71 86 L 80 30 Z"
          fill="url(#canBody)"
          opacity="0.95"
        />

        {/* Vertical Mesh Ribs */}
        <line
          x1="34"
          y1="33"
          x2="39"
          y2="87"
          stroke="#475569"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <line
          x1="42"
          y1="34"
          x2="45"
          y2="88"
          stroke="#475569"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <line
          x1="50"
          y1="35"
          x2="50"
          y2="88"
          stroke="#475569"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <line
          x1="58"
          y1="34"
          x2="55"
          y2="88"
          stroke="#475569"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <line
          x1="66"
          y1="33"
          x2="61"
          y2="87"
          stroke="#475569"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Horizontal Rib Rings */}
        <path
          d="M 23 48 Q 50 56 77 48"
          fill="none"
          stroke="#475569"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M 26 68 Q 50 76 74 68"
          fill="none"
          stroke="#475569"
          strokeWidth="1.5"
          opacity="0.5"
        />

        {/* Can Base */}
        <ellipse cx="50" cy="88" rx="19" ry="3.5" fill="#475569" />
      </svg>
    </div>
  );
}

/* ================= DOCK MAGNIFY ================= */
function DockMagnify({
  node,
  mouseX,
  onDragStart,
  onDropNode,
  onCtx,
  onOpenFile,
  onOpenFolder,
  onOpenMyPc,
  onOpenTrash,
  trashBadge,
}: {
  node: Node;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDropNode: (e: React.DragEvent, targetId: string) => void;
  onCtx: (e: React.MouseEvent, node: Node) => void;
  onOpenFile: (file: FileNode) => void;
  onOpenFolder: (id: string) => void;
  onOpenMyPc?: () => void;
  onOpenTrash?: () => void;
  trashBadge?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseX, (v) => {
    const b = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return v - b.x - b.width / 2;
  });
  const size = useSpring(useTransform(distance, [-190, 0, 190], [52, 92, 52]), {
    mass: 0.1,
    stiffness: 150,
    damping: 14,
  });
  const lift = useSpring(useTransform(distance, [-190, 0, 190], [0, -18, 0]), {
    mass: 0.1,
    stiffness: 150,
    damping: 14,
  });
  const op = useSpring(
    useTransform(distance, [-90, -40, 40, 90], [0, 1, 1, 0]),
    { mass: 0.1, stiffness: 200, damping: 20 },
  );

  const isFolder = node.kind === "folder";
  const isFile = node.kind === "file";

  return (
    <motion.div
      ref={ref}
      draggable
      onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, node.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDropNode(e as unknown as React.DragEvent, node.id);
      }}
      onContextMenu={(e) => onCtx(e as unknown as React.MouseEvent, node)}
      onClick={() => {
        if (node.id === "sys-mypc") onOpenMyPc?.();
        else if (node.id === "sys-trash") onOpenTrash?.();
        else if (isFolder) onOpenFolder(node.id);
        else if (isFile) onOpenFile(node as FileNode);
        else launch(node as AppNode);
      }}
      style={{ width: size, height: size, y: lift }}
      className="group relative flex shrink-0 items-end justify-center cursor-pointer"
    >
      <motion.span
        style={{ opacity: op }}
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900/90 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg backdrop-blur-md dark:bg-white/90 dark:text-slate-900"
      >
        {node.name}
      </motion.span>
      {node.id === "sys-mypc" ? (
        <MyPcDockIcon />
      ) : node.id === "sys-trash" ? (
        <TrashDockIcon isFull={Boolean(trashBadge && trashBadge > 0)} />
      ) : isFolder ? (
        <FolderGlyph folder={node as FolderNode} />
      ) : isFile ? (
        <FileGlyph file={node as FileNode} />
      ) : (
        <Glyph app={node as AppNode} />
      )}
      {node.id === "sys-trash" &&
        typeof trashBadge === "number" &&
        trashBadge > 0 && (
          <span className="pointer-events-none absolute -top-1 -right-1 z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white shadow ring-2 ring-white dark:ring-[#15101f]">
            {trashBadge}
          </span>
        )}
    </motion.div>
  );
}

/* ================= MODAL BASE ================= */
function Modal({
  onClose,
  children,
  width = 420,
}: {
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        style={{ width: `min(${width}px, 94vw)` }}
        className="relative max-h-[85vh] overflow-auto rounded-2xl border border-slate-200/90 bg-white/95 p-5 text-slate-900 shadow-2xl shadow-slate-900/15 backdrop-blur-2xl dark:border-white/10 dark:bg-[#14111f]/95 dark:text-white dark:shadow-black/70"
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ================= CONTEXT MENU ================= */
type Ctx = {
  x: number;
  y: number;
  type: "desktop" | "trash" | "mypc" | "node";
  node?: Node;
  zone?: Zone;
} | null;

type CtxItem = {
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function ContextMenu({
  ctx,
  items,
  onClose,
}: {
  ctx: NonNullable<Ctx>;
  items: CtxItem[];
  onClose: () => void;
}) {
  const x = Math.min(
    ctx.x,
    (typeof window !== "undefined" ? window.innerWidth : 9999) - 240,
  );
  const y = Math.min(
    ctx.y,
    (typeof window !== "undefined" ? window.innerHeight : 9999) -
      items.length * 36 -
      20,
  );

  return (
    <>
      <div
        className="fixed inset-0 z-[65]"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.12 }}
        style={{ left: Math.max(10, x), top: Math.max(10, y) }}
        className="fixed z-[70] w-56 overflow-hidden rounded-xl border border-slate-200/90 bg-white/95 py-1 text-slate-800 shadow-2xl shadow-slate-900/15 backdrop-blur-2xl dark:border-white/10 dark:bg-[#161420]/95 dark:text-white/90 dark:shadow-black/70"
      >
        {items.map((it, i) => (
          <button
            key={i}
            disabled={it.disabled}
            onClick={() => {
              it.onClick();
              onClose();
            }}
            className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] transition-colors ${
              it.disabled
                ? "cursor-not-allowed opacity-40"
                : it.danger
                  ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/15"
                  : "hover:bg-primary/10 hover:text-primary dark:hover:bg-white/10 dark:hover:text-white"
            }`}
          >
            <span className="h-4 w-4 shrink-0 opacity-80">{it.icon}</span>
            <span className="truncate">{it.label}</span>
          </button>
        ))}
      </motion.div>
    </>
  );
}

/* ================= FILE EDITOR (Notepad) ================= */
function FileEditorModal({
  file,
  onSave,
  onClose,
}: {
  file: FileNode;
  onSave: (id: string, name: string, content: string) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(file.name);
  const [content, setContent] = useState(file.content);
  const [saved, setSaved] = useState(true);

  const save = () => {
    onSave(file.id, name.trim() || "Ghi chú.txt", content);
    setSaved(true);
  };

  const download = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name.endsWith(".txt") ? name : `${name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [name, content]);

  return (
    <Modal onClose={onClose} width={580}>
      <div className="mb-3 flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-white/10">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
            }}
            className="rounded bg-transparent font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary/50 dark:text-white"
          />
          {!saved && (
            <span className="text-[10px] text-amber-500">• Chưa lưu</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={download}
            title="Tải tệp tin về máy"
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
          >
            <Download className="h-3.5 w-3.5" /> Tải về
          </button>
          <button
            onClick={save}
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow transition-opacity hover:opacity-90"
          >
            <Save className="h-3.5 w-3.5" /> Lưu (Ctrl+S)
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <textarea
        autoFocus
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setSaved(false);
        }}
        placeholder="Nhập nội dung ghi chú ở đây..."
        className="h-72 w-full resize-none rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 font-mono text-xs leading-relaxed text-slate-800 focus:border-primary/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/25 dark:border-white/10 dark:bg-black/30 dark:text-white/90 dark:focus:bg-black/40"
      />

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-white/40">
        <span>
          {content.length} ký tự • {content.split(/\r\n|\r|\n/).length} dòng
        </span>
        <span>Phím tắt: Ctrl + S để lưu</span>
      </div>
    </Modal>
  );
}

/* ================= FOLDER WINDOW ================= */
function FolderWindow({
  folder,
  zone,
  onDetach,
  onDragStart,
  onOpenFile,
  onClose,
}: {
  folder: FolderNode;
  zone: Zone;
  onDetach: (folderId: string, itemId: string, zone: Zone) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onOpenFile: (f: FileNode) => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} width={420}>
      <div className="mb-3 flex items-center gap-2 border-b border-slate-200/80 pb-3 dark:border-white/10">
        <FolderOpen className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold">{folder.name}</p>
        <span className="text-xs text-slate-400 dark:text-white/40">
          ({folder.children.length} mục)
        </span>
        <button
          onClick={onClose}
          className="ml-auto rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {folder.children.length === 0 ? (
        <p className="py-8 text-center text-xs text-slate-400 dark:text-white/40">
          Thư mục trống. Kéo ứng dụng hoặc tệp vào đây.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-3 py-2">
          {folder.children.map((c) => (
            <div
              key={c.id}
              draggable
              onDragStart={(e) => onDragStart(e, c.id)}
              onDragEnd={() => onDetach(folder.id, c.id, zone)}
              onClick={() => {
                if (c.kind === "file") onOpenFile(c as FileNode);
                else launch(c as AppNode);
              }}
              className="flex cursor-grab flex-col items-center gap-1.5 rounded-xl p-2 transition-colors hover:bg-black/5 active:cursor-grabbing dark:hover:bg-white/10"
            >
              <div className="h-12 w-12">
                {c.kind === "file" ? <FileGlyph file={c} /> : <Glyph app={c} />}
              </div>
              <span className="line-clamp-1 text-[11px] font-medium text-slate-800 dark:text-white/90">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-center text-[10px] text-slate-400 dark:text-white/40">
        Kéo ứng dụng hoặc tệp ra ngoài để chuyển về Desktop.
      </p>
    </Modal>
  );
}

/* ================= TRASH WINDOW ================= */
function TrashWindow({
  trash,
  onRestore,
  onRestoreAll,
  onDelete,
  onEmpty,
  onClose,
}: {
  trash: TrashItem[];
  onRestore: (i: number) => void;
  onRestoreAll: () => void;
  onDelete: (i: number) => void;
  onEmpty: () => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} width={480}>
      <div className="mb-3 flex items-center gap-2 border-b border-slate-200/80 pb-3 dark:border-white/10">
        <span className="text-xl">🗑️</span>
        <div>
          <p className="text-sm font-semibold">Thùng rác</p>
          <p className="text-[11px] text-slate-400 dark:text-white/40">
            {trash.length} mục đã xóa
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {trash.length > 0 && (
            <>
              <button
                onClick={onRestoreAll}
                className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
              >
                <RotateCcw className="h-3 w-3" /> Khôi phục tất cả
              </button>
              <button
                onClick={onEmpty}
                className="flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
              >
                <Trash className="h-3 w-3" /> Dọn sạch
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {trash.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="mb-2 text-4xl opacity-50">✨</span>
          <p className="text-xs font-medium text-slate-400 dark:text-white/40">
            Thùng rác trống.
          </p>
          <p className="text-[11px] text-slate-400/80 dark:text-white/30">
            Kéo bất kỳ ứng dụng hoặc tệp nào vào thùng rác để xóa.
          </p>
        </div>
      ) : (
        <div className="max-h-72 space-y-2 overflow-auto pr-1">
          {trash.map((t, i) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 dark:border-white/10 dark:bg-white/5"
            >
              <div className="h-10 w-10 shrink-0">
                {t.node.kind === "folder" ? (
                  <FolderGlyph folder={t.node} />
                ) : t.node.kind === "file" ? (
                  <FileGlyph file={t.node} />
                ) : (
                  <Glyph app={t.node} small />
                )}
              </div>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-white/95">
                  {t.node.name}
                </p>
                <p className="font-mono text-[10px] text-slate-400 dark:text-white/40">
                  Vị trí gốc: {t.origin === "dock" ? "Dock" : "Desktop"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onRestore(i)}
                  title="Khôi phục lại vị trí cũ"
                  className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/10 dark:text-white/90 dark:hover:bg-white/15"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-primary" /> Khôi phục
                </button>
                <button
                  onClick={() => onDelete(i)}
                  title="Xóa vĩnh viễn"
                  className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20"
                >
                  <Trash className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

/* ================= WALLPAPER SELECTOR ================= */
function WallpaperModal({
  current,
  onSelect,
  onClose,
}: {
  current: WallpaperKey;
  onSelect: (k: WallpaperKey) => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} width={480}>
      <div className="mb-4 flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-white/10">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold">Tùy chọn Hình nền Desktop</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(WALLPAPERS) as WallpaperKey[]).map((key) => {
          const wp = WALLPAPERS[key];
          const active = current === key;
          return (
            <button
              key={key}
              onClick={() => {
                onSelect(key);
                onClose();
              }}
              className={`group flex flex-col overflow-hidden rounded-xl border text-left transition-all ${
                active
                  ? "border-primary ring-2 ring-primary/40 shadow-md"
                  : "border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20"
              }`}
            >
              <div
                className={`relative h-24 w-full bg-gradient-to-br ${wp.lightBg} dark:${wp.darkBg} p-2`}
              >
                <div className="absolute right-2 top-2">
                  {active && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-slate-50/90 p-2.5 dark:bg-white/5">
                <p className="text-xs font-semibold text-slate-800 dark:text-white">
                  {wp.name}
                </p>
                <p className="line-clamp-1 text-[10px] text-slate-400 dark:text-white/40">
                  {wp.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

/* ================= MY PC ================= */
const DEV_QUOTES = [
  "Code chạy được là một phép màu, tốt nhất đừng đụng vào nữa! ✨",
  "Hôm nay là ngày đẹp trời để fix 1 bug và sinh ra 3 bug mới 🐞",
  "Không có bug, chỉ có tính năng chưa được document 📝",
  "Cà phê vào, code ra. Đôi khi ra bug ☕",
  "Trên máy em chạy bình thường mà anh... 💻",
  "Thứ 6 không deploy. Đó là quy luật sinh tồn 🛡️",
  "Có 2 điều khó nhất trong IT: Đặt tên biến và xóa cache 🧠",
  "Ngủ là để sạc pin, thức là để commit lúc 3h sáng 🌙",
  "Đời người ngắn ngủi, hãy dùng phím tắt nhiều hơn ⌨️",
  "Đang compile... vui lòng không thở mạnh ⏳",
];

function MyPcModal({
  user,
  onClose,
}: {
  user: MappedUser;
  onClose: () => void;
}) {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [caffeine, setCaffeine] = useState(250);
  const [ramBoosted, setRamBoosted] = useState(false);

  useEffect(() => {
    setQuoteIdx(Math.floor(Math.random() * DEV_QUOTES.length));
  }, []);

  const nextQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % DEV_QUOTES.length);
  };

  const boostRam = () => {
    setRamBoosted(true);
    setTimeout(() => setRamBoosted(false), 2000);
  };

  const addCoffee = () => {
    setCaffeine((prev) => prev + 100);
  };

  const Row = ({ k, v }: { k: string; v: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-3 py-1 text-xs">
      <span className="text-slate-400 dark:text-white/45">{k}</span>
      <span className="truncate text-right font-medium text-slate-800 dark:text-white/90">
        {v}
      </span>
    </div>
  );

  return (
    <Modal onClose={onClose} width={450}>
      {/* macOS window title bar with traffic dots */}
      <div className="mb-3 flex items-center gap-2 border-b border-slate-200/80 pb-3 dark:border-white/10">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-500/90 shadow-sm" />
          <span className="h-3 w-3 rounded-full bg-amber-500/90 shadow-sm" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/90 shadow-sm" />
        </div>
        <p className="ml-2 text-xs font-semibold tracking-tight text-slate-700 dark:text-white/90">
          Giới thiệu về VNTEZ OS
        </p>
        <button
          onClick={onClose}
          className="ml-auto rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* OS Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-purple-500/10 p-3.5 text-center dark:border-white/10 dark:bg-white/5">
          <div className="mx-auto mb-2 flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 ring-2 ring-white/50">
            <span className="text-3xl">🪐</span>
          </div>
          <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            VNTEZ OS Ultra Pro Max
          </h3>
          <p className="text-[11px] font-mono text-slate-500 dark:text-white/60">
            Phiên bản 2026.4.2 • Mã hiệu:{" "}
            <span className="font-semibold text-primary">Cà Phê Muối</span>
          </p>
        </div>

        {/* Developer Quote of the Moment */}
        <div className="relative rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 dark:border-amber-400/20 dark:bg-amber-400/5">
          <div className="flex items-center justify-between pb-1.5">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
              <Sparkles className="h-3.5 w-3.5" /> Châm ngôn Dev hôm nay
            </span>
            <button
              onClick={nextQuote}
              className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium text-amber-700 hover:bg-amber-500/10 dark:text-amber-300"
            >
              <RefreshCw className="h-3 w-3" /> Đổi câu khác
            </button>
          </div>
          <p className="text-xs italic text-slate-700 dark:text-white/85">
            "{DEV_QUOTES[quoteIdx]}"
          </p>
        </div>

        {/* Fun Cosmic Hardware Specs */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-white/5">
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-white/45">
            Cấu hình phần cứng vũ trụ
          </p>
          <Row k="Vi xử lý" v="Quantum Core i99-9990K @ 9.9 GHz ⚡" />
          <Row
            k="Bộ nhớ RAM"
            v={
              ramBoosted ? (
                <span className="font-bold text-emerald-500">
                  128 TB (Đã dọn sạch sẽ! ✨)
                </span>
              ) : (
                "128 TB Cloud DDR7 (Chrome ngốn 99%)"
              )
            }
          />
          <Row k="Đồ họa" v="VNTEZ RTX 6090 Ti 128GB (Render Meme 4K)" />
          <Row k="Ổ cứng" v="1,000 PB SSD (Lưu toàn ý tưởng triệu đô 💡)" />
          <Row k="Pin hệ thống" v="99.9% (Tối đi ngủ, sáng chạy tiếp 🔋)" />
          <Row k="Caffeine nạp" v={`${caffeine} mg (Đủ tỉnh táo đến mai ☕)`} />
        </div>

        {/* Interactive Fun Buttons */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={boostRam}
            disabled={ramBoosted}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 py-2 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-500/20 active:scale-98 dark:text-sky-300"
          >
            <Zap className="h-3.5 w-3.5" />
            {ramBoosted ? "Đang giải phóng RAM..." : "Giải phóng 128TB RAM"}
          </button>
          <button
            onClick={addCoffee}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 py-2 text-xs font-semibold text-amber-600 transition-colors hover:bg-amber-500/20 active:scale-98 dark:text-amber-300"
          >
            <Coffee className="h-3.5 w-3.5" /> Nạp Cà phê (+100mg)
          </button>
        </div>

        {/* Account Info */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-indigo-600 text-sm font-bold text-white shadow">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-bold text-slate-800 dark:text-white">
                  {user.name}
                </p>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-bold text-primary">
                  Tổng tư lệnh 👑
                </span>
              </div>
              <p className="truncate font-mono text-[11px] text-slate-400 dark:text-white/50">
                {user.email || "user@vntez.cloud"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ================= ADD APP MODAL ================= */
function AddAppModal({
  layout,
  onClose,
  onAdd,
}: {
  layout: Layout;
  onClose: () => void;
  onAdd: (n: string, u: string, i: string) => Promise<void> | void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setErr("Vui lòng nhập tên ứng dụng.");
    if (!isUrl(url)) return setErr("Link phải là URL http(s) hợp lệ.");
    if (urlTaken(layout, url.trim()))
      return setErr("Ứng dụng này đã tồn tại trong hệ thống.");

    try {
      setSubmitting(true);
      setErr(null);
      await onAdd(name.trim(), url.trim(), icon.trim());
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Đã có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "h-10 w-full rounded-lg border border-slate-200/90 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/25 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/35 disabled:opacity-50";

  return (
    <Modal onClose={onClose}>
      <div className="mb-3 flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-white/10">
        <p className="text-sm font-semibold">Thêm lối tắt ứng dụng</p>
        <button
          onClick={onClose}
          disabled={submitting}
          className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-white/70">
            Tên ứng dụng
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Google Docs"
            className={field}
            disabled={submitting}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-white/70">
            Địa chỉ Web (URL)
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className={field}
            disabled={submitting}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-white/70">
            Icon URL (tùy chọn - mặc định lấy favicon)
          </label>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="https://.../icon.png"
            className={field}
            disabled={submitting}
          />
        </div>
        {err && <p className="text-xs text-rose-500">{err}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground shadow transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting
            ? "Đang lưu vào Supabase..."
            : "Thêm vào màn hình Desktop"}
        </button>
      </form>
    </Modal>
  );
}

/* ================= CLOCK & USER MENU ================= */
function MenuClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(t);
  }, []);

  if (!now)
    return (
      <span className="hidden font-mono text-xs opacity-60 sm:block">...</span>
    );
  return (
    <span className="hidden font-mono text-xs font-medium tracking-tight sm:block">
      {now.toLocaleString("vi-VN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
}

function UserMenu({ user }: { user: MappedUser }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const doLogout = async () => {
    setBusy(true);
    try {
      await signOut();
    } catch {
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-slate-200 transition-all hover:ring-primary/50 dark:ring-white/15 dark:hover:ring-white/30"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute right-0 top-11 z-50 w-64 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 text-slate-800 shadow-2xl shadow-slate-900/15 backdrop-blur-2xl dark:border-white/10 dark:bg-black/80 dark:text-white dark:shadow-black/70"
          >
            <div className="flex items-center gap-3 border-b border-slate-200/80 p-3 dark:border-white/10">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full ring-1 ring-slate-200 object-cover dark:ring-white/15"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 leading-tight">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate font-mono text-[11px] text-slate-400 dark:text-white/45">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-3.5 py-2.5 text-xs text-slate-600 dark:text-white/80">
              <span>Giao diện</span>
              <ModeToggle />
            </div>
            <div className="my-1 h-px bg-slate-200/80 dark:bg-white/10" />
            <button
              onClick={doLogout}
              disabled={busy}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" />
              {busy ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ================= MAIN DASHBOARD ================= */
export function AccountDashboard({
  user,
  initialSystemApps = [],
  initialUserApps = [],
}: {
  user: MappedUser;
  initialSystemApps?: SystemApp[];
  initialUserApps?: UserApp[];
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const initialData = useMemo(
    () => buildLayoutFromApps(initialSystemApps, initialUserApps),
    [initialSystemApps, initialUserApps],
  );
  const [layout, setLayout] = useState<Layout>(() => initialData.layout);
  const [trash, setTrash] = useState<TrashItem[]>([]);
  const [wallpaper, setWallpaper] = useState<WallpaperKey>("aurora");
  const [soundEnabled, setSoundEnabled] = useState(true);

  /* Grid position state */
  const [posMap, setPosMap] = useState<PosMap>(() => initialData.initialPosMap);
  const [canvasDim, setCanvasDim] = useState({ width: 1200, height: 750 });
  const [showGrid, setShowGrid] = useState(false);
  const [hoverSlot, setHoverSlot] = useState<SlotPos | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const [isOverTrash, setIsOverTrash] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOriginZone, setDragOriginZone] = useState<Zone | null>(null);

  /* modals */
  const [ctx, setCtx] = useState<Ctx>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [openFile, setOpenFile] = useState<FileNode | null>(null);
  const [showTrash, setShowTrash] = useState(false);
  const [showMyPc, setShowMyPc] = useState(false);
  const [showWallpaper, setShowWallpaper] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const hydrated = useRef(false);

  /* Calculate dynamic grid dimensions */
  const gridCols = Math.max(
    4,
    Math.floor((canvasDim.width - PAD_X * 2) / CELL_W),
  );
  const gridRows = Math.max(
    4,
    Math.floor((canvasDim.height - PAD_Y * 2) / CELL_H),
  );

  // Đồng bộ layout và vị trí khi props từ server thay đổi
  useEffect(() => {
    const res = buildLayoutFromApps(initialSystemApps, initialUserApps);
    setLayout(res.layout);
    setPosMap((prev) => ({
      ...res.initialPosMap,
      ...prev,
    }));
  }, [initialSystemApps, initialUserApps]);

  /* Measure canvas */
  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      if (mainRef.current) {
        setCanvasDim({
          width: mainRef.current.clientWidth || window.innerWidth,
          height: mainRef.current.clientHeight || window.innerHeight - 110,
        });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (mainRef.current) ro.observe(mainRef.current);
    window.addEventListener("resize", updateSize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  /* LocalStorage Hydration: KHÔNG lưu đè apps vào localStorage (vì apps lưu trên Supabase) */
  useEffect(() => {
    try {
      // Dọn dẹp key cũ để tránh đè layout cũ từ client
      localStorage.removeItem("povixa.desktop.v4");
      localStorage.removeItem("povixa.desktop.v3");
      localStorage.removeItem("povixa.desktop.grid.v3");
      localStorage.removeItem("povixa.desktop.grid.v4");
      localStorage.removeItem("povixa.desktop.grid.v5");

      const savedWp = localStorage.getItem(WALLPAPER_KEY) as WallpaperKey;
      if (savedWp && WALLPAPERS[savedWp]) setWallpaper(savedWp);
      const savedSound = localStorage.getItem(SOUND_KEY);
      if (savedSound !== null) setSoundEnabled(savedSound === "true");
      const savedPos = localStorage.getItem(POS_KEY);
      if (savedPos) {
        try {
          const parsed = JSON.parse(savedPos);
          setPosMap((prev) => ({
            ...prev,
            ...parsed,
          }));
        } catch {
          /* */
        }
      }
    } catch {
      /* ignore */
    }
    hydrated.current = true;
  }, []);

  // Tự động phân bổ vị trí ô trống trên lưới cho các app mới từ Supabase
  useEffect(() => {
    setPosMap((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const node of layout.desktop) {
        if (!next[node.id]) {
          next[node.id] = findFreeSlot(next);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [layout.desktop]);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(WALLPAPER_KEY, wallpaper);
    } catch {
      /* */
    }
  }, [wallpaper]);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(SOUND_KEY, String(soundEnabled));
    } catch {
      /* */
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(posMap));
    } catch {
      /* */
    }
  }, [posMap]);

  /* Global dragend safety */
  useEffect(() => {
    const handleWindowDragEnd = () => {
      setIsDragging(false);
      setDraggingId(null);
      setHoverSlot(null);
      setIsOverTrash(false);
    };
    window.addEventListener("dragend", handleWindowDragEnd);
    return () => window.removeEventListener("dragend", handleWindowDragEnd);
  }, []);

  /* Helper to find next free slot */
  const findFreeSlot = (currentPosMap: PosMap): SlotPos => {
    const occupied = new Set(
      Object.values(currentPosMap).map((p) => `${p.col}-${p.row}`),
    );
    // Scan column-first (vertical priority)
    for (let c = 0; c < gridCols; c++) {
      for (let r = 0; r < gridRows; r++) {
        if (!occupied.has(`${c}-${r}`)) return { col: c, row: r };
      }
    }
    return { col: 0, row: gridRows };
  };

  /* Ensure all nodes have valid grid positions */
  useEffect(() => {
    setPosMap((prev) => {
      let changed = false;
      const next: PosMap = { ...prev };

      // Ensure system icons have positions
      if (!next["sys-mypc"]) {
        next["sys-mypc"] = { col: 0, row: 0 };
        changed = true;
      }
      if (!next["sys-trash"]) {
        next["sys-trash"] = { col: 0, row: 1 };
        changed = true;
      }

      // Assign position for desktop nodes that lack one
      for (const n of layout.desktop) {
        if (!next[n.id]) {
          next[n.id] = findFreeSlot(next);
          changed = true;
        }
      }

      // Cleanup positions of deleted nodes
      const validDesktopIds = new Set([
        "sys-mypc",
        "sys-trash",
        ...layout.desktop.map((n) => n.id),
      ]);
      for (const id of Object.keys(next)) {
        if (!validDesktopIds.has(id)) {
          delete next[id];
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [layout.desktop, gridCols, gridRows]);

  const showNotification = (
    message: string,
    actionLabel?: string,
    onAction?: () => void,
  ) => {
    const id = uid();
    setToast({ id, message, actionLabel, onAction });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 4000);
  };

  const zoneOfNode = (id: string): Zone | null => {
    const t = findTop(layout, id);
    return t ? t.z : null;
  };

  const openFolder = openFolderId
    ? ([...layout.desktop, ...layout.dock].find(
        (n) => n.id === openFolderId && n.kind === "folder",
      ) as FolderNode | undefined)
    : undefined;
  const openFolderZone = openFolderId ? zoneOfNode(openFolderId) : null;

  /* DRAG & DROP */
  const onDragStart = (
    e: React.DragEvent,
    id: string,
    zone: Zone = "desktop",
  ) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.setData("application/vntez-origin", zone);
    setIsDragging(true);
    setDraggingId(id);
    setDragOriginZone(zone);
    playUiSound("click", soundEnabled);
  };

  const onDragEnd = () => {
    setIsDragging(false);
    setDraggingId(null);
    setDragOriginZone(null);
    setHoverSlot(null);
    setIsOverTrash(false);
  };

  /* Drop on canvas slot */
  const placeItemAt = (
    id: string,
    col: number,
    row: number,
    originZone: Zone = "desktop",
  ) => {
    // 1. Kéo từ DOCK ra DESKTOP:
    if (originZone === "dock") {
      // Nếu là Máy của tôi hoặc Thùng rác, chỉ cập nhật vị trí trên Desktop
      if (id === "sys-mypc" || id === "sys-trash") {
        setPosMap((prev) => ({ ...prev, [id]: { col, row } }));
        playUiSound("pop", soundEnabled);
        return;
      }

      const dockNode = layout.dock.find((n) => n.id === id);
      if (dockNode) {
        const s = srcOf(dockNode);
        const existing = layout.desktop.find((n) => srcOf(n) === s);
        if (existing) {
          // Icon đã có sẵn trên desktop -> chỉ di chuyển vị trí của nó
          setPosMap((prev) => ({ ...prev, [existing.id]: { col, row } }));
          playUiSound("pop", soundEnabled);
        } else {
          // Chưa có -> tạo shortcut trên desktop
          const cloned = clonePin(dockNode);
          setLayout((l) => ({ ...l, desktop: [...l.desktop, cloned] }));
          setPosMap((prev) => ({ ...prev, [cloned.id]: { col, row } }));
          playUiSound("pop", soundEnabled);
          showNotification(`Đã thêm "${cloned.name}" vào Desktop`);
        }
      }
      return;
    }

    // 2. KÉO THẢ TRÊN MÀN HÌNH DESKTOP (di chuyển tự do bất kỳ icon nào: PC, Thùng rác, system apps, user apps, files...)
    const occupiedEntry = Object.entries(posMap).find(
      ([nodeId, p]) => nodeId !== id && p.col === col && p.row === row,
    );

    if (occupiedEntry) {
      const [targetId] = occupiedEntry;

      // Thả vào Thùng rác
      if (targetId === "sys-trash" && id !== "sys-trash") {
        if (
          id === "sys-mypc" ||
          id === "welcome-file" ||
          layout.desktop.some(
            (n) => n.id === id && n.kind === "app" && n.isSystem,
          )
        ) {
          showNotification("Mục hệ thống không thể xóa vào Thùng rác");
          playUiSound("pop", soundEnabled);
        } else {
          moveToTrash(id);
        }
        return;
      }

      // Thả vào thư mục đã có trên desktop
      const dragNode = layout.desktop.find((n) => n.id === id);
      const targetNode = layout.desktop.find((n) => n.id === targetId);

      if (
        dragNode &&
        targetNode &&
        targetNode.kind === "folder" &&
        dragNode.kind !== "folder" &&
        id !== "sys-mypc" &&
        id !== "sys-trash" &&
        id !== "welcome-file" &&
        !(dragNode.kind === "app" && dragNode.isSystem)
      ) {
        setLayout((l) => ({
          ...l,
          desktop: l.desktop
            .filter((n) => n.id !== id)
            .map((n) =>
              n.id === targetId
                ? { ...n, children: [...(n as FolderNode).children, dragNode] }
                : n,
            ),
        }));
        setPosMap((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
        playUiSound("pop", soundEnabled);
        showNotification(
          `Đã chuyển "${dragNode.name}" vào "${targetNode.name}"`,
        );
        return;
      }

      // Đổi chỗ (swap positions) hai biểu tượng trên màn hình
      const myPos = posMap[id] || { col: 0, row: 0 };
      setPosMap((prev) => ({
        ...prev,
        [id]: { col, row },
        [targetId]: myPos,
      }));
      playUiSound("pop", soundEnabled);

      // Đồng bộ tọa độ nếu là user_apps
      const nodeA = layout.desktop.find((n) => n.id === id);
      if (nodeA && nodeA.kind === "app" && !nodeA.isSystem) {
        updateUserApp(srcOf(nodeA), { grid_col: col, grid_row: row }).catch(
          () => {},
        );
      }
      const nodeB = layout.desktop.find((n) => n.id === targetId);
      if (nodeB && nodeB.kind === "app" && !nodeB.isSystem) {
        updateUserApp(srcOf(nodeB), {
          grid_col: myPos.col,
          grid_row: myPos.row,
        }).catch(() => {});
      }
      return;
    }

    // Ô trống -> Di chuyển trực tiếp đến ô này
    setPosMap((prev) => ({
      ...prev,
      [id]: { col, row },
    }));
    playUiSound("pop", soundEnabled);

    // Đồng bộ tọa độ nếu là user_apps
    const node = layout.desktop.find((n) => n.id === id);
    if (node && node.kind === "app" && !node.isSystem) {
      updateUserApp(srcOf(node), { grid_col: col, grid_row: row }).catch(
        () => {},
      );
    }
  };

  /* Main Canvas Drag Over & Drop */
  const handleMainDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - PAD_X;
    const relY = e.clientY - rect.top - PAD_Y;
    const c = Math.max(0, Math.min(gridCols - 1, Math.floor(relX / CELL_W)));
    const r = Math.max(0, Math.min(gridRows - 1, Math.floor(relY / CELL_H)));
    if (!hoverSlot || hoverSlot.col !== c || hoverSlot.row !== r) {
      setHoverSlot({ col: c, row: r });
    }
  };

  const handleMainDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const originZone =
      (e.dataTransfer.getData("application/vntez-origin") as Zone) ||
      dragOriginZone ||
      "desktop";

    if (!id || !mainRef.current) {
      onDragEnd();
      return;
    }
    const rect = mainRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - PAD_X;
    const relY = e.clientY - rect.top - PAD_Y;
    const c = Math.max(0, Math.min(gridCols - 1, Math.floor(relX / CELL_W)));
    const r = Math.max(0, Math.min(gridRows - 1, Math.floor(relY / CELL_H)));

    placeItemAt(id, c, r, originZone);
    onDragEnd();
  };

  const dropDock = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) {
      // Nếu đã có trong dock thì không clone thêm
      if (layout.dock.some((n) => n.id === id)) {
        onDragEnd();
        return;
      }
      const top = findTop(layout, id);
      const node = top ? layout[top.z][top.i] : null;
      if (node) {
        setLayout((l) => ({ ...l, dock: [...l.dock, clonePin(node)] }));
        playUiSound("pop", soundEnabled);
        showNotification(`Đã ghim "${node.name}" vào thanh Dock`);
        if (node.kind === "app" && !node.isSystem) {
          updateUserApp(srcOf(node), {
            is_pinned: true,
            dock_order: layout.dock.length,
          }).catch(() => {});
        }
      }
    }
    onDragEnd();
  };

  const dropNode = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const id = e.dataTransfer.getData("text/plain");
    const originZone =
      (e.dataTransfer.getData("application/vntez-origin") as Zone) ||
      dragOriginZone ||
      "desktop";

    if (!id || id === targetId) {
      onDragEnd();
      return;
    }

    // 1. Kéo thả giữa các icon trên Dock -> Sắp xếp lại thứ tự Dock
    if (originZone === "dock") {
      const dragDockIndex = layout.dock.findIndex((n) => n.id === id);
      const targetDockIndex = layout.dock.findIndex((n) => n.id === targetId);
      if (dragDockIndex >= 0 && targetDockIndex >= 0) {
        setLayout((l) => {
          const nextDock = [...l.dock];
          const [moved] = nextDock.splice(dragDockIndex, 1);
          nextDock.splice(targetDockIndex, 0, moved);
          return { ...l, dock: nextDock };
        });
        playUiSound("pop", soundEnabled);
        onDragEnd();
        return;
      }
    }

    // 2. Thả vào Thùng rác
    if (targetId === "sys-trash") {
      if (id === "sys-mypc" || id === "sys-trash" || id === "welcome-file") {
        showNotification("Mục hệ thống không thể xóa vào Thùng rác");
        playUiSound("pop", soundEnabled);
      } else if (originZone === "dock") {
        setLayout((l) => ({
          ...l,
          dock: l.dock.filter((x) => x.id !== id),
        }));
        playUiSound("pop", soundEnabled);
        showNotification("Đã bỏ ghim khỏi thanh Dock");
      } else {
        moveToTrash(id);
      }
      onDragEnd();
      return;
    }

    const targetPos = posMap[targetId];
    if (targetPos) {
      placeItemAt(id, targetPos.col, targetPos.row, originZone);
    }
    onDragEnd();
  };

  const detach = (folderId: string, itemId: string, zone: Zone) => {
    setLayout((l) => detachFromFolder(l, folderId, itemId, zone));
    setPosMap((prev) => {
      const free = findFreeSlot(prev);
      return { ...prev, [itemId]: free };
    });
    playUiSound("pop", soundEnabled);
  };

  /* TRASH ACTIONS */
  const moveToTrash = (nodeId: string) => {
    if (
      nodeId === "sys-mypc" ||
      nodeId === "sys-trash" ||
      nodeId === "welcome-file"
    ) {
      showNotification("Mục hệ thống không thể xóa vào Thùng rác");
      playUiSound("pop", soundEnabled);
      return;
    }

    const top = findTop(layout, nodeId);
    let targetNode: Node | null = null;
    let originZone: Zone = "desktop";

    if (top) {
      originZone = top.z;
      targetNode = layout[top.z][top.i];
    } else {
      for (const z of ["desktop", "dock"] as Zone[]) {
        for (const n of layout[z]) {
          if (n.kind === "folder") {
            const child = n.children.find((c) => c.id === nodeId);
            if (child) {
              targetNode = child;
              originZone = z;
              break;
            }
          }
        }
        if (targetNode) break;
      }
    }

    if (!targetNode) return;

    if (
      (targetNode.kind === "app" && targetNode.isSystem) ||
      targetNode.id === "welcome-file"
    ) {
      showNotification("Mục hệ thống không thể xóa vào Thùng rác");
      playUiSound("pop", soundEnabled);
      return;
    }

    const s = srcOf(targetNode);
    setLayout((l) => purgeSrc(l, s));
    setPosMap((prev) => {
      const next = { ...prev };
      delete next[nodeId];
      return next;
    });

    const newTrashItem: TrashItem = {
      id: uid(),
      node: targetNode,
      origin: originZone,
      deletedAt: Date.now(),
    };
    setTrash((t) => [...t, newTrashItem]);
    setSelectedId(null);
    playUiSound("trash", soundEnabled);

    showNotification(
      `Đã chuyển "${targetNode.name}" vào Thùng rác`,
      "Hoàn tác",
      () => restoreLastItem(),
    );
  };

  const restoreItem = (index: number) => {
    const t = trash[index];
    if (!t) return;
    setLayout((l) => ({ ...l, [t.origin]: [...l[t.origin], t.node] }));
    setPosMap((prev) => {
      const free = findFreeSlot(prev);
      return { ...prev, [t.node.id]: free };
    });
    setTrash((tr) => tr.filter((_, j) => j !== index));
    playUiSound("restore", soundEnabled);
    showNotification(`Đã khôi phục "${t.node.name}" về màn hình`);
  };

  const restoreLastItem = () => {
    if (trash.length === 0) return;
    restoreItem(trash.length - 1);
  };

  const restoreAll = () => {
    const count = trash.length;
    if (count === 0) return;
    setLayout((l) => {
      const desk = [...l.desktop];
      const dk = [...l.dock];
      trash.forEach((t) => {
        if (t.origin === "dock") dk.push(t.node);
        else desk.push(t.node);
      });
      return { desktop: desk, dock: dk };
    });
    setPosMap((prev) => {
      const next = { ...prev };
      trash.forEach((t) => {
        if (t.origin === "desktop") {
          next[t.node.id] = findFreeSlot(next);
        }
      });
      return next;
    });
    setTrash([]);
    playUiSound("restore", soundEnabled);
    showNotification(`Đã khôi phục toàn bộ ${count} mục`);
  };

  const permDel = async (index: number) => {
    const t = trash[index];
    if (t && t.node.kind === "app" && !t.node.isSystem) {
      try {
        await deleteUserApp(t.node.id);
        showNotification(`Đã xóa vĩnh viễn "${t.node.name}" trên Supabase`);
      } catch (err) {
        console.error("Lỗi xóa user app trên Supabase:", err);
      }
    }
    setTrash((tr) => tr.filter((_, j) => j !== index));
    playUiSound("trash", soundEnabled);
  };

  const emptyTrash = async () => {
    const count = trash.length;
    const userAppsInTrash = trash.filter(
      (t) => t.node.kind === "app" && !t.node.isSystem,
    );
    for (const t of userAppsInTrash) {
      try {
        await deleteUserApp(t.node.id);
      } catch (err) {
        console.error("Lỗi xóa app trong trash:", err);
      }
    }
    setTrash([]);
    playUiSound("trash", soundEnabled);
    showNotification(`Đã dọn sạch thùng rác (${count} mục)`);
  };

  /* CREATION */
  const createFolder = () => {
    const newId = uid();
    const free = findFreeSlot(posMap);
    setLayout((l) => ({
      ...l,
      desktop: [
        ...l.desktop,
        { id: newId, kind: "folder", name: "Thư mục mới", children: [] },
      ],
    }));
    setPosMap((prev) => ({ ...prev, [newId]: free }));
    setRenaming(newId);
    setRenameVal("Thư mục mới");
    playUiSound("pop", soundEnabled);
  };

  const createTextFile = () => {
    const newId = uid();
    const free = findFreeSlot(posMap);
    const newFile: FileNode = {
      id: newId,
      src: newId,
      kind: "file",
      name: "Ghi chú mới.txt",
      content: "",
      fileType: "txt",
      updatedAt: Date.now(),
    };
    setLayout((l) => ({ ...l, desktop: [...l.desktop, newFile] }));
    setPosMap((prev) => ({ ...prev, [newId]: free }));
    setRenaming(newId);
    setRenameVal("Ghi chú mới.txt");
    playUiSound("pop", soundEnabled);
  };

  const addApp = async (name: string, url: string, icon: string) => {
    try {
      const free = findFreeSlot(posMap);
      const savedApp = await addUserApp({
        name,
        url,
        icon_url: icon || null,
        is_pinned: false,
        dock_order: 0,
        grid_col: free.col,
        grid_row: free.row,
      });

      const newAppNode = mapUserAppToNode(savedApp);

      setLayout((l) => ({
        ...l,
        desktop: [...l.desktop, newAppNode],
      }));
      setPosMap((prev) => ({ ...prev, [newAppNode.id]: free }));
      playUiSound("pop", soundEnabled);
      showNotification(`Đã lưu ứng dụng "${name}" vào Supabase`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Không thể thêm ứng dụng";
      showNotification(`Lỗi: ${msg}`);
      throw err;
    }
  };

  const saveFile = (id: string, name: string, content: string) => {
    setLayout((l) => {
      const updateNode = (n: Node): Node => {
        if (n.id === id && n.kind === "file")
          return { ...n, name, content, updatedAt: Date.now() };
        if (n.kind === "folder") {
          return {
            ...n,
            children: n.children.map((c) =>
              c.id === id && c.kind === "file"
                ? { ...c, name, content, updatedAt: Date.now() }
                : c,
            ),
          };
        }
        return n;
      };
      return {
        desktop: l.desktop.map(updateNode),
        dock: l.dock.map(updateNode),
      };
    });
    setOpenFile((prev) =>
      prev?.id === id
        ? { ...prev, name, content, updatedAt: Date.now() }
        : prev,
    );
    showNotification(`Đã lưu "${name}"`);
  };

  /* RENAMING */
  const startRename = (n: Node) => {
    setRenaming(n.id);
    setRenameVal(n.name);
  };

  const commitRename = async () => {
    if (!renaming) return;
    const v = renameVal.trim() || "Không tên";
    const targetNode = [...layout.desktop, ...layout.dock].find(
      (n) => n.id === renaming,
    );

    if (targetNode && targetNode.kind === "app" && !targetNode.isSystem) {
      try {
        await updateUserApp(renaming, { name: v });
      } catch (err) {
        console.error("Lỗi đổi tên app trên Supabase:", err);
      }
    }

    setLayout((l) => {
      const update = (n: Node): Node =>
        n.id === renaming ? { ...n, name: v } : n;
      return { desktop: l.desktop.map(update), dock: l.dock.map(update) };
    });
    setRenaming(null);
  };

  /* ARRANGE & SORTING FUNCTIONS */
  const arrangeVertical = () => {
    const allIds = [
      "sys-mypc",
      "sys-trash",
      ...layout.desktop.map((n) => n.id),
    ];
    const newPos: PosMap = {};
    allIds.forEach((id, index) => {
      const col = Math.floor(index / gridRows);
      const row = index % gridRows;
      newPos[id] = { col, row };
    });
    setPosMap(newPos);
    playUiSound("pop", soundEnabled);
    showNotification("Đã sắp xếp biểu tượng thành 1 cột dọc");
  };

  const arrangeHorizontal = () => {
    const allIds = [
      "sys-mypc",
      "sys-trash",
      ...layout.desktop.map((n) => n.id),
    ];
    const newPos: PosMap = {};
    allIds.forEach((id, index) => {
      const row = Math.floor(index / gridCols);
      const col = index % gridCols;
      newPos[id] = { col, row };
    });
    setPosMap(newPos);
    playUiSound("pop", soundEnabled);
    showNotification("Đã sắp xếp biểu tượng thành 1 hàng ngang");
  };

  const sortByName = () => {
    const sorted = [...layout.desktop].sort((a, b) =>
      a.name.localeCompare(b.name, "vi"),
    );
    setLayout((l) => ({ ...l, desktop: sorted }));
    const allIds = ["sys-mypc", "sys-trash", ...sorted.map((n) => n.id)];
    const newPos: PosMap = {};
    allIds.forEach((id, index) => {
      const col = Math.floor(index / gridRows);
      const row = index % gridRows;
      newPos[id] = { col, row };
    });
    setPosMap(newPos);
    playUiSound("click", soundEnabled);
    showNotification("Đã sắp xếp biểu tượng theo tên A-Z");
  };

  const sortDesktopByType = () => {
    const sorted = [...layout.desktop].sort((a, b) => {
      const order = { folder: 1, file: 2, app: 3 };
      return (order[a.kind] || 9) - (order[b.kind] || 9);
    });
    setLayout((l) => ({ ...l, desktop: sorted }));
    const allIds = ["sys-mypc", "sys-trash", ...sorted.map((n) => n.id)];
    const newPos: PosMap = {};
    allIds.forEach((id, index) => {
      const col = Math.floor(index / gridRows);
      const row = index % gridRows;
      newPos[id] = { col, row };
    });
    setPosMap(newPos);
    playUiSound("click", soundEnabled);
    showNotification(
      "Đã sắp xếp biểu tượng theo loại (Thư mục ➔ Tệp ➔ Ứng dụng)",
    );
  };

  /* PIN TOGGLE */
  const pinToggle = (n: Node, zone: Zone) => {
    if (n.id === "sys-mypc" || n.id === "sys-trash") {
      showNotification("Mục hệ thống luôn được ghim trên thanh Dock");
      return;
    }

    const isCurrentlyPinned = layout.dock.some(
      (x) => x.id === n.id || srcOf(x) === srcOf(n),
    );
    const willPin = !isCurrentlyPinned;

    setLayout((l) => {
      if (isCurrentlyPinned) {
        return {
          ...l,
          dock: l.dock.filter((x) => x.id !== n.id && srcOf(x) !== srcOf(n)),
        };
      }
      return { ...l, dock: [...l.dock, clonePin(n)] };
    });
    playUiSound("pop", soundEnabled);
    showNotification(
      willPin
        ? `Đã ghim "${n.name}" vào thanh Dock`
        : `Đã bỏ ghim "${n.name}" khỏi thanh Dock`,
    );

    // Đồng bộ trạng thái ghim và thứ tự dock lên Supabase nếu là user_apps
    if (n.kind === "app" && !n.isSystem) {
      updateUserApp(srcOf(n), {
        is_pinned: willPin,
        dock_order: willPin ? layout.dock.length : 0,
      }).catch((err) => console.warn("Lỗi đồng bộ ghim lên Supabase:", err));
    }
  };

  /* CONTEXT MENU ITEMS */
  const openCtx = (
    e: React.MouseEvent,
    type: "desktop" | "trash" | "mypc" | "node",
    node?: Node,
    zone?: Zone,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setCtx({ x: e.clientX, y: e.clientY, type, node, zone });
  };

  const ctxItems = useMemo((): CtxItem[] => {
    if (!ctx) return [];

    if (ctx.type === "desktop") {
      return [
        {
          label: "Tạo tệp ghi chú mới",
          icon: <FileText className="h-4 w-4" />,
          onClick: createTextFile,
        },
        {
          label: "Tạo thư mục mới",
          icon: <FolderOpen className="h-4 w-4" />,
          onClick: createFolder,
        },
        {
          label: "Thêm lối tắt ứng dụng",
          icon: <ExternalLink className="h-4 w-4" />,
          onClick: () => setShowAdd(true),
        },
        {
          label:
            trash.length > 0
              ? `Khôi phục: "${trash[trash.length - 1].node.name}"`
              : "Khôi phục mục vừa xóa",
          icon: <Undo2 className="h-4 w-4" />,
          disabled: trash.length === 0,
          onClick: restoreLastItem,
        },
        {
          label: "Sắp xếp thành cột dọc",
          icon: <ArrowDown className="h-4 w-4" />,
          onClick: arrangeVertical,
        },
        {
          label: "Sắp xếp thành hàng ngang",
          icon: <ArrowRight className="h-4 w-4" />,
          onClick: arrangeHorizontal,
        },
        {
          label: "Sắp xếp theo tên (A-Z)",
          icon: <ArrowUpDown className="h-4 w-4" />,
          onClick: sortByName,
        },
        {
          label: "Sắp xếp theo loại",
          icon: <ArrowUpDown className="h-4 w-4" />,
          onClick: sortDesktopByType,
        },
        {
          label: showGrid ? "Ẩn lưới ô Desktop" : "Hiển thị lưới ô Desktop",
          icon: <GridIcon className="h-4 w-4" />,
          onClick: () => setShowGrid((v) => !v),
        },
        {
          label: "Đổi hình nền Desktop",
          icon: <ImageIcon className="h-4 w-4" />,
          onClick: () => setShowWallpaper(true),
        },
        ...(trash.length > 0
          ? [
              {
                label: "Dọn sạch thùng rác",
                icon: <Trash className="h-4 w-4" />,
                danger: true,
                onClick: emptyTrash,
              },
            ]
          : []),
      ];
    }

    if (ctx.type === "trash") {
      return [
        {
          label: "Mở thùng rác",
          icon: <FolderOpen className="h-4 w-4" />,
          onClick: () => setShowTrash(true),
        },
        {
          label: "Khôi phục mục vừa xóa",
          icon: <Undo2 className="h-4 w-4" />,
          disabled: trash.length === 0,
          onClick: restoreLastItem,
        },
        {
          label: "Dọn sạch thùng rác",
          icon: <Trash className="h-4 w-4" />,
          danger: true,
          disabled: trash.length === 0,
          onClick: emptyTrash,
        },
      ];
    }

    if (ctx.type === "mypc") {
      return [
        {
          label: "Xem thông tin máy tính",
          icon: <Monitor className="h-4 w-4" />,
          onClick: () => setShowMyPc(true),
        },
      ];
    }

    // Node items
    const n = ctx.node!;
    const zone = ctx.zone ?? "desktop";
    const pinned = zone === "dock";

    const baseActions: CtxItem[] = [];

    if (n.kind === "file") {
      baseActions.push(
        {
          label: "Mở & chỉnh sửa",
          icon: <FileText className="h-4 w-4" />,
          onClick: () => setOpenFile(n),
        },
        {
          label: "Tải xuống (.txt)",
          icon: <Download className="h-4 w-4" />,
          onClick: () => {
            const blob = new Blob([n.content], {
              type: "text/plain;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = n.name.endsWith(".txt") ? n.name : `${n.name}.txt`;
            a.click();
            URL.revokeObjectURL(url);
          },
        },
      );
    } else if (n.kind === "folder") {
      baseActions.push({
        label: "Mở thư mục",
        icon: <FolderOpen className="h-4 w-4" />,
        onClick: () => setOpenFolderId(n.id),
      });
    } else {
      baseActions.push({
        label: "Mở ứng dụng",
        icon: <ExternalLink className="h-4 w-4" />,
        onClick: () => launch(n as AppNode),
      });
    }

    const isCurrentlyPinned = layout.dock.some(
      (d) => d.id === n.id || srcOf(d) === srcOf(n),
    );

    const isSystemItem =
      n.id === "sys-mypc" ||
      n.id === "sys-trash" ||
      n.id === "welcome-file" ||
      (n.kind === "app" && Boolean(n.isSystem));

    const extraActions: CtxItem[] = [];

    // Ghim / Bỏ ghim: Cho phép với TẤT CẢ các app (cả system apps và user apps)
    if (n.id !== "sys-mypc" && n.id !== "sys-trash") {
      extraActions.push({
        label: isCurrentlyPinned
          ? "Bỏ ghim khỏi thanh Dock"
          : "Ghim vào thanh Dock",
        icon: isCurrentlyPinned ? (
          <PinOff className="h-4 w-4" />
        ) : (
          <Pin className="h-4 w-4" />
        ),
        onClick: () => pinToggle(n, zone),
      });
    }

    // Đổi tên & Thùng rác: Chỉ dành cho user items
    if (!isSystemItem) {
      extraActions.push(
        {
          label: "Đổi tên",
          icon: <Pencil className="h-4 w-4" />,
          onClick: () => startRename(n),
        },
        {
          label: "Bỏ vào thùng rác",
          icon: <Trash className="h-4 w-4" />,
          danger: true,
          onClick: () => moveToTrash(n.id),
        },
      );
    }

    return [...baseActions, ...extraActions];
  }, [ctx, layout, trash, showGrid]);

  /* KEYBOARD SHORTCUTS */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        renaming ||
        openFile ||
        showAdd ||
        showTrash ||
        showMyPc ||
        showWallpaper
      )
        return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        if (
          selectedId === "sys-mypc" ||
          selectedId === "sys-trash" ||
          selectedId === "welcome-file"
        ) {
          showNotification("Mục hệ thống không thể xóa vào Thùng rác");
          playUiSound("pop", soundEnabled);
          return;
        }
        moveToTrash(selectedId);
      } else if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        restoreLastItem();
      } else if (e.key === "Escape") {
        setSelectedId(null);
        setCtx(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedId, renaming, openFile, trash]);

  const mouseX = useMotionValue(Infinity);
  const activeWp = WALLPAPERS[wallpaper] || WALLPAPERS.aurora;
  const isDark = mounted ? resolvedTheme === "dark" : true;

  /* Helper to check if slot is occupied */
  const isOccupied = (c: number, r: number) => {
    return Object.values(posMap).some((p) => p.col === c && p.row === r);
  };

  return (
    <div
      onClick={() => setSelectedId(null)}
      className="relative flex h-screen w-full flex-col overflow-hidden bg-background text-foreground select-none"
    >
      {/* ================= WALLPAPER BACKGROUND ================= */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className={`absolute inset-0 bg-gradient-to-br transition-all duration-700 ${
            isDark ? activeWp.darkBg : activeWp.lightBg
          }`}
        />
        {(isDark ? activeWp.darkBlobs : activeWp.lightBlobs).map(
          (blobCls, i) => (
            <div
              key={i}
              className={`absolute rounded-full transition-all duration-700 ${blobCls}`}
            />
          ),
        )}
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* ================= TOP MENUBAR ================= */}
      <header className="relative z-20 flex items-center justify-between border-b border-black/5 bg-white/40 px-5 py-2 backdrop-blur-md dark:border-white/5 dark:bg-black/20 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight text-slate-800 transition-opacity hover:opacity-80 dark:text-white/90"
          >
            <img src="/logo.svg" alt="VNTEZ ID" className="h-5 w-5" />
            <span className="text-sm font-bold tracking-tight">VNTEZ ID</span>
          </Link>
          <span className="hidden text-xs text-slate-400 dark:text-white/30 sm:inline">
            • Desktop
          </span>
          <Link
            href="/developers"
            title="Mở VNTEZ Developer Hub & OAuth 2.0 Playground"
            className="ml-2 flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/20 shadow-sm"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Developer Hub</span>
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowGrid((v) => !v)}
            title={showGrid ? "Ẩn lưới căn chỉnh" : "Hiển thị lưới căn chỉnh ô"}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors shadow-sm ${
              showGrid
                ? "border-primary bg-primary text-primary-foreground"
                : "border-slate-200/80 bg-white/40 text-slate-700 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
            }`}
          >
            <GridIcon className="h-4 w-4" />
          </button>

          <button
            onClick={() => setSoundEnabled((v) => !v)}
            title={
              soundEnabled ? "Tắt âm thanh hiệu ứng" : "Bật âm thanh hiệu ứng"
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white/40 text-slate-700 shadow-sm transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4 opacity-50" />
            )}
          </button>

          <button
            onClick={() => setShowWallpaper(true)}
            title="Đổi hình nền Desktop"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/80 bg-white/40 text-slate-700 shadow-sm transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
          >
            <ImageIcon className="h-4 w-4" />
          </button>

          <MenuClock />
          <UserMenu user={user} />
        </div>
      </header>

      {/* ================= DESKTOP CANVAS ================= */}
      <main
        ref={mainRef}
        onDragOver={handleMainDragOver}
        onDragLeave={() => setHoverSlot(null)}
        onDrop={handleMainDrop}
        onContextMenu={(e) => openCtx(e, "desktop")}
        className="relative z-10 flex-1 overflow-auto p-4 select-none"
      >
        <div
          className="relative"
          style={{
            minWidth: Math.max(gridCols * CELL_W, 700),
            minHeight: Math.max(gridRows * CELL_H + 80, 500),
          }}
        >
          {/* ── 2D GRID SLOTS (hiển thị khi kéo thả hoặc khi bật chế độ lưới) ── */}
          {(isDragging || showGrid) && (
            <div className="pointer-events-none absolute inset-0 z-0">
              {Array.from({ length: gridRows }).map((_, r) =>
                Array.from({ length: gridCols }).map((_, c) => {
                  const isHover = hoverSlot?.col === c && hoverSlot?.row === r;
                  const occupied = isOccupied(c, r);
                  return (
                    <div
                      key={`guide-${c}-${r}`}
                      style={{
                        position: "absolute",
                        left: PAD_X + c * CELL_W + 4,
                        top: PAD_Y + r * CELL_H + 4,
                        width: CELL_W - 8,
                        height: CELL_H - 8,
                      }}
                      className={`rounded-2xl transition-all duration-150 flex flex-col items-center justify-center ${
                        isHover
                          ? "border-2 border-primary bg-primary/20 shadow-lg shadow-primary/25 scale-105"
                          : occupied
                            ? "border border-dashed border-primary/20 bg-primary/[0.02]"
                            : "border border-dashed border-primary/30 bg-primary/[0.04]"
                      }`}
                    >
                      {!occupied && (
                        <span className="font-mono text-xs font-bold text-primary/40 select-none">
                          +
                        </span>
                      )}
                    </div>
                  );
                }),
              )}
            </div>
          )}

          {/* ── SYSTEM ICON: MÁY CỦA TÔI ── */}
          <div
            style={{
              position: "absolute",
              left: PAD_X + (posMap["sys-mypc"]?.col ?? 0) * CELL_W,
              top: PAD_Y + (posMap["sys-mypc"]?.row ?? 0) * CELL_H,
              width: CELL_W,
              height: CELL_H,
              transition: isDragging
                ? "none"
                : "left 0.2s cubic-bezier(0.2,0.8,0.2,1), top 0.2s cubic-bezier(0.2,0.8,0.2,1)",
              zIndex: draggingId === "sys-mypc" ? 40 : 20,
              opacity: draggingId === "sys-mypc" ? 0.4 : 1,
            }}
            draggable
            onDragStart={(e) => onDragStart(e, "sys-mypc", "desktop")}
            onDragEnd={onDragEnd}
          >
            <SysIcon
              emoji="🖥️"
              label="Máy của tôi"
              selected={selectedId === "sys-mypc"}
              onClick={() => {
                setSelectedId("sys-mypc");
                setShowMyPc(true);
              }}
              onContextMenu={(e) => openCtx(e, "mypc")}
            />
          </div>

          {/* ── SYSTEM ICON: THÙNG RÁC ── */}
          <div
            style={{
              position: "absolute",
              left: PAD_X + (posMap["sys-trash"]?.col ?? 0) * CELL_W,
              top: PAD_Y + (posMap["sys-trash"]?.row ?? 1) * CELL_H,
              width: CELL_W,
              height: CELL_H,
              transition: isDragging
                ? "none"
                : "left 0.2s cubic-bezier(0.2,0.8,0.2,1), top 0.2s cubic-bezier(0.2,0.8,0.2,1)",
              zIndex: draggingId === "sys-trash" ? 40 : 20,
              opacity: draggingId === "sys-trash" ? 0.4 : 1,
            }}
            draggable
            onDragStart={(e) => onDragStart(e, "sys-trash", "desktop")}
            onDragEnd={onDragEnd}
          >
            <TrashSysIcon
              badge={trash.length}
              isOver={isOverTrash}
              selected={selectedId === "sys-trash"}
              onClick={() => {
                setSelectedId("sys-trash");
                setShowTrash(true);
              }}
              onContextMenu={(e) => openCtx(e, "trash")}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (draggingId !== "sys-trash") {
                  e.dataTransfer.dropEffect = "move";
                  setIsOverTrash(true);
                }
              }}
              onDragLeave={() => setIsOverTrash(false)}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOverTrash(false);
                const id = e.dataTransfer.getData("text/plain");
                if (id && id !== "sys-trash") {
                  if (id === "sys-mypc" || id === "welcome-file") {
                    showNotification(
                      "Mục hệ thống không thể xóa vào Thùng rác",
                    );
                    playUiSound("pop", soundEnabled);
                  } else {
                    moveToTrash(id);
                  }
                }
                onDragEnd();
              }}
            />
          </div>

          {/* ── DESKTOP NODES ── */}
          {layout.desktop
            .filter((n) => n.id !== "sys-mypc" && n.id !== "sys-trash")
            .map((n) => {
              const pos = posMap[n.id] ?? { col: 0, row: 2 };
              const isThisDragging = draggingId === n.id;
              return (
                <div
                  key={n.id}
                  style={{
                    position: "absolute",
                    left: PAD_X + pos.col * CELL_W,
                    top: PAD_Y + pos.row * CELL_H,
                    width: CELL_W,
                    height: CELL_H,
                    transition: isDragging
                      ? "none"
                      : "left 0.2s cubic-bezier(0.2,0.8,0.2,1), top 0.2s cubic-bezier(0.2,0.8,0.2,1)",
                    zIndex: isThisDragging ? 40 : 20,
                    opacity: isThisDragging ? 0.4 : 1,
                  }}
                >
                  <DesktopIcon
                    node={n}
                    selected={selectedId === n.id}
                    renaming={renaming === n.id}
                    renameVal={renameVal}
                    setRenameVal={setRenameVal}
                    commitRename={commitRename}
                    onSelect={setSelectedId}
                    onDragStart={(e, id) => onDragStart(e, id, "desktop")}
                    onDragEnd={onDragEnd}
                    onDropNode={dropNode}
                    onCtx={(e, nd) => openCtx(e, "node", nd, "desktop")}
                    onOpenFolder={setOpenFolderId}
                    onOpenFile={(f) => setOpenFile(f)}
                  />
                </div>
              );
            })}
        </div>
      </main>

      {/* ================= DOCK ================= */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.2 }}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={dropDock}
        className="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-end gap-2.5 rounded-[22px] border border-white/70 bg-white/60 px-3.5 py-2 shadow-xl shadow-slate-900/10 backdrop-blur-2xl dark:border-white/10 dark:bg-black/35 dark:shadow-2xl dark:shadow-black/60"
      >
        {layout.dock.map((n) => (
          <DockMagnify
            key={n.id}
            node={n}
            mouseX={mouseX}
            onDragStart={(e, id) => onDragStart(e, id, "dock")}
            onDropNode={dropNode}
            onCtx={(e, nd) => {
              if (nd.id === "sys-mypc") openCtx(e, "mypc");
              else if (nd.id === "sys-trash") openCtx(e, "trash");
              else openCtx(e, "node", nd, "dock");
            }}
            onOpenFile={(f) => setOpenFile(f)}
            onOpenFolder={setOpenFolderId}
            onOpenMyPc={() => setShowMyPc(true)}
            onOpenTrash={() => setShowTrash(true)}
            trashBadge={trash.length}
          />
        ))}
      </motion.div>

      {/* ================= TOAST NOTIFICATION ================= */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed bottom-24 right-6 z-50 flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white/95 px-4 py-2.5 text-slate-800 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-[#181524]/95 dark:text-white dark:shadow-black/50"
          >
            <span className="text-xs font-medium">{toast.message}</span>
            {toast.onAction && (
              <button
                onClick={() => {
                  toast.onAction?.();
                  setToast(null);
                }}
                className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
              >
                {toast.actionLabel}
              </button>
            )}
            <button
              onClick={() => setToast(null)}
              className="rounded p-1 text-slate-400 hover:text-slate-700 dark:text-white/40 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= OVERLAYS & MODALS ================= */}
      {ctx && (
        <ContextMenu ctx={ctx} items={ctxItems} onClose={() => setCtx(null)} />
      )}
      {showAdd && (
        <AddAppModal
          layout={layout}
          onClose={() => setShowAdd(false)}
          onAdd={addApp}
        />
      )}
      {openFile && (
        <FileEditorModal
          file={openFile}
          onSave={saveFile}
          onClose={() => setOpenFile(null)}
        />
      )}
      {openFolder && openFolderZone && (
        <FolderWindow
          folder={openFolder}
          zone={openFolderZone}
          onDetach={detach}
          onDragStart={onDragStart}
          onOpenFile={(f) => setOpenFile(f)}
          onClose={() => setOpenFolderId(null)}
        />
      )}
      {showTrash && (
        <TrashWindow
          trash={trash}
          onRestore={restoreItem}
          onRestoreAll={restoreAll}
          onDelete={permDel}
          onEmpty={emptyTrash}
          onClose={() => setShowTrash(false)}
        />
      )}
      {showMyPc && <MyPcModal user={user} onClose={() => setShowMyPc(false)} />}
      {showWallpaper && (
        <WallpaperModal
          current={wallpaper}
          onSelect={(k) => {
            setWallpaper(k);
            showNotification(`Đã đổi sang hình nền "${WALLPAPERS[k].name}"`);
          }}
          onClose={() => setShowWallpaper(false)}
        />
      )}
    </div>
  );
}
