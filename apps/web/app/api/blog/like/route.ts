import { NextResponse } from "next/server";
import { incrementLike } from "@/lib/blog-storage";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const likes = await incrementLike(slug);
    return NextResponse.json({ success: true, likesCount: likes });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
