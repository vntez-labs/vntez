import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@workspace/auth/cookies";
import type { VntezUser } from "@workspace/auth/types";

export async function getVerifiedIamSession() {
  const accessToken = (await cookies()).get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  if (!accessToken) return null;

  const iamUrl = process.env.NEXT_PUBLIC_VNTEZ_IAM_URL || "https://vntez-iam.vercel.app";
  const response = await fetch(new URL("/oauth/userinfo", iamUrl), {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });

  if (response.status === 401 || response.status === 403) return null;
  if (!response.ok) throw new Error("Không thể xác minh phiên VNTEZ IAM");

  const user: VntezUser = await response.json();
  if (typeof user.sub !== "string" || !user.sub) {
    throw new Error("VNTEZ IAM trả về định danh không hợp lệ");
  }
  return { user, accessToken };
}
