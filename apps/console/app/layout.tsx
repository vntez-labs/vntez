import type { Metadata, Viewport } from "next";
import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@workspace/auth/provider";
import { getServerSession } from "@workspace/auth/server";

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
      className="dark font-sans antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>
          <AuthProvider initialUser={user} initialToken={accessToken}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
