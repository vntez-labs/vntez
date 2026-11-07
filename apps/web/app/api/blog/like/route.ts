import { NextResponse } from "next/server";
import { toggleLike } from "@/lib/blog-storage";

export async function POST(req: Request) {
  try {
    const { slug, action } = await req.json();
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const likes = await toggleLike(slug, action === "unlike" ? "unlike" : "like");
    return NextResponse.json({ success: true, likesCount: likes });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error processing like";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
