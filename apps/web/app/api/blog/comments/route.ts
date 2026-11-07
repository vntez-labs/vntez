import { NextResponse } from "next/server";
import { addComment, deleteComment } from "@/lib/blog-storage";

export async function POST(req: Request) {
  try {
    const { slug, author, content, parentId, replyToAuthor, avatar } = await req.json();
    if (!slug || !author || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const res = await addComment(slug, author, content, parentId, replyToAuthor, avatar);
    if (!res) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json({ success: true, ...res });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error adding comment";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const commentId = searchParams.get("commentId");

    if (!slug || !commentId) {
      return NextResponse.json({ error: "Missing slug or commentId" }, { status: 400 });
    }

    const res = await deleteComment(slug, commentId);
    return NextResponse.json(res);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error deleting comment";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
