import type { Metadata, Viewport } from "next"
import { Be_Vietnam_Pro, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ScrollToTop } from "@/components/landing/scroll-to-top"

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
})

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
})

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
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#080c14" },
  ],
  colorScheme: "dark light",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://vntez.net"),
  title: {
    default: "vntez — Hệ điều hành & Hạ tầng Công nghệ Doanh nghiệp",
    template: "%s | vntez",
  },
  description:
    "Hệ sinh thái công nghệ đa tầng vntez: Hạ tầng lưu trữ Edge S3 NVMe tốc độ cao, định danh bảo mật OAuth 2.0 PKCE, máy bán hàng BMAN Offline-First và chuỗi cung ứng thông minh tại Việt Nam.",
  keywords: [
    "vntez",
    "vntez.net",
    "vntez-id",
    "Lưu trữ Edge S3",
    "NVMe S3 Vietnam",
    "BMAN POS",
    "Offline-First SQLite",
    "OAuth 2.0 PKCE",
    "Smart Logistics WMS",
    "Công nghệ Việt Nam",
    "Chủ quyền số",
  ],
  authors: [
    { name: "VNTEZ LABS", url: "https://vntez.net" },
    { name: "hnamhocit", url: "https://github.com/hnamhocit" },
  ],
  creator: "hnamhocit",
  publisher: "VNTEZ LABS",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://vntez.net",
    siteName: "vntez Platform",
    title: "vntez — Hệ điều hành & Hạ tầng Công nghệ Doanh nghiệp",
    description:
      "Hợp nhất lưu trữ Edge S3 NVMe, định danh OAuth 2.0 PKCE và giải pháp bán lẻ Offline-First tại Việt Nam.",
  },
  twitter: {
    card: "summary_large_image",
    title: "vntez — Hệ điều hành & Hạ tầng Công nghệ Doanh nghiệp",
    description:
      "Hợp nhất lưu trữ Edge S3 NVMe, định danh OAuth 2.0 PKCE và giải pháp bán lẻ Offline-First tại Việt Nam.",
    creator: "@hnamhocit",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://vntez.net",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://vntez.net/#organization",
      name: "VNTEZ LABS",
      url: "https://vntez.net",
      logo: "https://vntez.net/icon.svg",
      sameAs: [
        "https://github.com/hnamhocit",
        "https://facebook.com/hnamhocit",
      ],
      description:
        "Hệ sinh thái công nghệ đa tầng: Hạ tầng lưu trữ Edge S3, Định danh OAuth 2.0 PKCE và Bán lẻ Offline-First.",
    },
    {
      "@type": "WebSite",
      "@id": "https://vntez.net/#website",
      url: "https://vntez.net",
      name: "vntez",
      publisher: { "@id": "https://vntez.net/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      name: "vntez Platform",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Cross-platform (Linux, Windows, macOS, Android, iOS)",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "VND",
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn(
        beVietnamPro.variable,
        plusJakartaSans.variable,
        jetbrainsMono.variable,
        "font-sans antialiased selection:bg-[#fb291a]/20 selection:text-[#fb291a]"
      )}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans transition-colors duration-200">
            <Header />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <ScrollToTop />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
