import { NextResponse } from "next/server";
import { getStoredBlogPosts, saveStoredBlogPosts } from "@/lib/storage-content";

export async function POST(req: Request) {
  try {
    const { slug, action } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Thiếu slug bài viết" }, { status: 400 });
    }

    const posts = await getStoredBlogPosts();
    const target = posts.find((p) => p.slug === slug);
    if (!target) {
      return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    }

    if (action === "unlike") {
      target.likesCount = Math.max(0, (target.likesCount || 0) - 1);
    } else {
      target.likesCount = (target.likesCount || 0) + 1;
    }

    await saveStoredBlogPosts(posts);

    return NextResponse.json({
      success: true,
      likesCount: target.likesCount,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xử lý like";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
