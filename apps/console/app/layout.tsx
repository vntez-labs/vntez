import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@workspace/auth/provider";
import { getServerSession } from "@workspace/auth/server";
import { cn } from "@workspace/ui/lib/utils";

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
  title: {
    default: "VNTEZ Console - Trung tâm Quản trị Bảo mật",
    template: "%s | VNTEZ Console",
  },
  description:
    "Hệ thống điều hành và bảng điều khiển quản trị trung tâm được bảo vệ bởi VNTEZ ID OAuth 2.0 PKCE.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#080c14",
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
        "dark font-sans antialiased"
      )}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>
          <AuthProvider initialUser={user} initialToken={accessToken}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
