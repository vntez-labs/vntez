import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { cookieDomain } from "./domains";

export async function createClient(request?: Request) {
  const cookieStore = await cookies();

  let host: string | null = null;
  try {
    const headerList = await headers();
    host = headerList.get("x-forwarded-host") || headerList.get("host");
  } catch {
    // Không có trong request context tĩnh
  }

  if (!host && request) {
    host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://placeholder-vntez-id.supabase.co";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "placeholder-anon-key";

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookieOptions: {
        domain: cookieDomain(host),
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
      cookies: {
        getAll: () => {
          const storeCookies = cookieStore.getAll();
          if (storeCookies && storeCookies.length > 0) {
            return storeCookies;
          }
          // Fallback dự phòng đọc từ request.headers nếu cookieStore bị rỗng
          if (request) {
            const raw = request.headers.get("cookie") || "";
            return raw
              .split(";")
              .map((c) => c.trim())
              .filter(Boolean)
              .map((c) => {
                const [name, ...val] = c.split("=");
                return { name, value: val.join("=") };
              });
          }
          return [];
        },
        setAll: (c) => {
          try {
            c.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        },
      },
    },
  );
}
