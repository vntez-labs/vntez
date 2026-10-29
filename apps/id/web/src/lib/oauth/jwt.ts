import crypto from "crypto";
import jwt from "jsonwebtoken";

const DEFAULT_SECRET =
  process.env.VNTEZ_JWT_SECRET ||
  "vntez_identity_jwt_secret_signing_key_2026_super_secure_auth";

/**
 * Lấy Issuer URL chuẩn cho token
 */
export function getIssuerUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "https://vntez-id.vercel.app";
}

export interface AccessTokenClaims {
  sub: string;
  aud: string;
  iss: string;
  iat: number;
  exp: number;
  email?: string;
  name?: string;
  avatar?: string | null;
}

/**
 * Cấp Access Token JWT (Ký bằng RS256 nếu có Private Key, hoặc HS256 với Secret)
 */
export function signAccessToken(params: {
  userId: string;
  clientId: string;
  email?: string;
  name?: string;
  avatar?: string | null;
  expiresInSeconds?: number;
}): { accessToken: string; expiresIn: number } {
  const expiresIn = params.expiresInSeconds ?? 3600; // Mặc định 1 giờ
  const privateKey = process.env.VNTEZ_JWT_PRIVATE_KEY;
  const isRS256 = Boolean(privateKey && privateKey.includes("PRIVATE KEY"));

  const payload: Omit<AccessTokenClaims, "iat" | "exp"> = {
    iss: getIssuerUrl(),
    sub: params.userId,
    aud: params.clientId,
    email: params.email,
    name: params.name,
    avatar: params.avatar,
  };

  const token = jwt.sign(payload, isRS256 ? privateKey! : DEFAULT_SECRET, {
    algorithm: isRS256 ? "RS256" : "HS256",
    expiresIn,
  });

  return { accessToken: token, expiresIn };
}

/**
 * Xác thực Access Token JWT
 */
export function verifyAccessToken(token: string): AccessTokenClaims {
  const publicKey = process.env.VNTEZ_JWT_PUBLIC_KEY;
  const privateKey = process.env.VNTEZ_JWT_PRIVATE_KEY;
  const isRS256 = Boolean(
    (publicKey && publicKey.includes("PUBLIC KEY")) ||
      (privateKey && privateKey.includes("PRIVATE KEY")),
  );

  const keyToUse = isRS256 ? publicKey || privateKey! : DEFAULT_SECRET;
  const algorithms: jwt.Algorithm[] = isRS256 ? ["RS256"] : ["HS256"];

  const decoded = jwt.verify(token, keyToUse, {
    algorithms,
  }) as AccessTokenClaims;

  return decoded;
}
