import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LandingPage } from "@/components/landing-page";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "VNTEZ ID — Nền tảng Định danh Tập trung & OAuth 2.0 SSO",
  description:
    "Một định danh cho toàn bộ hệ sinh thái của bạn. Nền tảng xác thực tập trung theo chuẩn OAuth 2.0 PKCE S256 và OpenID Connect.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "VNTEZ ID — Nền tảng Định danh Tập trung & OAuth 2.0 SSO",
    description:
      "Một định danh cho toàn bộ hệ sinh thái của bạn. Nền tảng xác thực tập trung theo chuẩn OAuth 2.0 PKCE S256 và OpenID Connect.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "VNTEZ ID — Nền tảng Định danh Tập trung & OAuth 2.0 SSO",
    description:
      "Một định danh cho toàn bộ hệ sinh thái của bạn. Nền tảng xác thực tập trung theo chuẩn OAuth 2.0 PKCE S256 và OpenID Connect.",
  },
};

async function AccountContent() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Đã đăng nhập và không có redirect_url -> chuyển hướng thẳng tới VNTEZ Console
  if (user) {
    redirect("https://vntez-console.vercel.app");
  }

  // Chưa đăng nhập -> hiển thị LandingPage
  return <LandingPage />;
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
