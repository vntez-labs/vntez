import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@workspace/auth/provider";
import { getServerSession } from "@workspace/auth/server";
import { cn } from "@workspace/ui/lib/utils";
import { TopProgressBar } from "@workspace/ui/components/top-progress-bar";
import { Toaster } from "@workspace/ui/components/toaster";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["500", "600", "700", "800"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-mono",
  display: "swap",
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    "monospace",
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vntez-console.vercel.app"),
  title: {
    default: "VNTEZ Console - Trung tâm Quản trị Bảo mật",
    template: "%s | VNTEZ Console",
  },
  description:
    "Hệ thống điều hành và bảng điều khiển quản trị trung tâm được bảo vệ bởi VNTEZ IAM OAuth 2.0 PKCE.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://vntez-console.vercel.app",
    siteName: "VNTEZ Console",
    title: "VNTEZ Console - Trung tâm Quản trị Bảo mật",
    description:
      "Bảng điều khiển quản trị trung tâm cụm lưu trữ Edge S3 NVMe, định danh OAuth 2.0 PKCE và theo dõi trạng thái hệ thống.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VNTEZ Console - Trung tâm Quản trị Bảo mật",
    description:
      "Bảng điều khiển quản trị trung tâm cụm lưu trữ Edge S3 NVMe, định danh OAuth 2.0 PKCE và theo dõi trạng thái hệ thống.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, accessToken } = await getServerSession();

  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn(
        beVietnamPro.variable,
        plusJakartaSans.variable,
        jetbrainsMono.variable,
        "font-sans antialiased"
      )}
    >
      <body
        spellCheck={false}
        className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary"
      >
        <ThemeProvider>
          <TopProgressBar />
          <Toaster />
          <AuthProvider initialUser={user} initialToken={accessToken}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
