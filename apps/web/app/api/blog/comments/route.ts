import { NextResponse } from "next/server";
import { addComment } from "@/lib/blog-storage";

export async function POST(req: Request) {
  try {
    const { slug, author, content } = await req.json();
    if (!slug || !author || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const res = await addComment(slug, author, content);
    if (!res) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({ success: true, ...res });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
