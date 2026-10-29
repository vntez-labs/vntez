import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@workspace/ui/lib/utils";

// Primary Font for Body & UI: 100% Vietnamese support, pristine baseline and diacritics
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

// Display Font for Headings, Metrics & Numbers: geometric, high-impact big tech display
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

// Code & Tech Glyphs: Terminal, API specs, Configs
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vntez-id.vercel.app";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#090D16" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VNTEZ ID — Unified Identity & OAuth 2.0 Platform",
    template: "%s | VNTEZ ID",
  },
  description:
    "Một định danh cho toàn bộ hệ sinh thái kỹ thuật VNTEZ. Nền tảng xác thực tập trung OAuth 2.0 PKCE, bảo mật và liền mạch.",
  applicationName: "VNTEZ ID",
  authors: [{ name: "VNTEZ Cloud", url: siteUrl }],
  generator: "Next.js",
  keywords: [
    "VNTEZ ID",
    "VNTEZ Cloud",
    "SSO",
    "Single Sign-On",
    "Identity Provider",
    "Xác thực tập trung",
    "OAuth2",
    "PKCE",
    "Bảo mật tài khoản",
  ],
  creator: "VNTEZ Cloud",
  publisher: "VNTEZ Cloud",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "vi-VN": "/",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/logo-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    alternateLocale: ["en_US"],
    url: "/",
    siteName: "VNTEZ ID",
    title: "VNTEZ ID — Nền tảng Định danh Tập trung & OAuth 2.0 SSO",
    description:
      "Một định danh cho toàn bộ hệ sinh thái của bạn. Xác thực tập trung theo chuẩn OAuth 2.0 PKCE S256 và OpenID Connect.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "VNTEZ ID — Nền tảng Định danh Tập trung & OAuth 2.0 SSO",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VNTEZ ID — Nền tảng Định danh Tập trung & OAuth 2.0 SSO",
    description:
      "Một định danh cho toàn bộ hệ sinh thái của bạn. Xác thực tập trung theo chuẩn OAuth 2.0 PKCE S256 và OpenID Connect.",
    images: ["/opengraph-image"],
    creator: "@vntezcloud",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "authentication",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "VNTEZ Cloud",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon.svg`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "VNTEZ ID",
      description:
        "Unified Identity Provider & Single Sign-On for the VNTEZ Cloud ecosystem.",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      inLanguage: "vi-VN",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={cn(
        beVietnamPro.variable,
        plusJakartaSans.variable,
        jetbrainsMono.variable,
        "font-sans antialiased selection:bg-[#fb291a]/20 selection:text-[#fb291a]"
      )}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
