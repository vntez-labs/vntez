import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { LoginContent } from "@/components/login-content";
import { createClient } from "@/lib/supabase/server";
import { safeReturnTo } from "@/lib/redirect";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description:
    "Đăng nhập một lần an toàn vào VNTEZ ID bằng Google, GitHub hoặc Facebook để truy cập toàn bộ hệ sinh thái VNTEZ Cloud.",
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: "Đăng nhập | VNTEZ ID",
    description:
      "Đăng nhập một lần an toàn vào VNTEZ ID bằng Google, GitHub hoặc Facebook.",
    url: "/login",
  },
  twitter: {
    card: "summary_large_image",
    title: "Đăng nhập | VNTEZ ID",
    description:
      "Đăng nhập một lần an toàn vào VNTEZ ID bằng Google, GitHub hoặc Facebook.",
  },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Nếu người dùng đã đăng nhập sẵn
  if (user) {
    const params = await searchParams;
    const returnTo = safeReturnTo(params.redirect_url);
    if (returnTo) {
      redirect(returnTo);
    }
    redirect("https://vntez-console.vercel.app");
  }

  return <LoginContent />;
}
