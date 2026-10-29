import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { DeveloperHub } from "@/components/developers/developer-hub";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Tài liệu Kỹ thuật & OAuth 2.0 API",
  description:
    "Tài liệu tích hợp và hướng dẫn kết nối Single Sign-On OAuth 2.0 PKCE & OpenID Connect cho hệ sinh thái VNTEZ ID.",
  alternates: {
    canonical: "/developers",
  },
  openGraph: {
    title: "Tài liệu Kỹ thuật & OAuth 2.0 API | VNTEZ ID",
    description:
      "Tài liệu tích hợp và hướng dẫn kết nối Single Sign-On OAuth 2.0 PKCE & OpenID Connect cho hệ sinh thái VNTEZ ID.",
    url: "/developers",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tài liệu Kỹ thuật & OAuth 2.0 API | VNTEZ ID",
    description:
      "Tài liệu tích hợp và hướng dẫn kết nối Single Sign-On OAuth 2.0 PKCE & OpenID Connect cho hệ sinh thái VNTEZ ID.",
  },
};

async function DevelopersContent() {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vntez-id.vercel.app";

  let mappedUser = null;
  if (user) {
    const meta = user.user_metadata ?? {};
    mappedUser = {
      id: user.id,
      name: meta.full_name || meta.name || user.email?.split("@")[0] || "User",
      email: user.email ?? "",
      avatar: meta.avatar_url || meta.picture || null,
    };
  }

  return <DeveloperHub user={mappedUser} siteUrl={siteUrl} />;
}

export default function DevelopersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <DevelopersContent />
    </Suspense>
  );
}
