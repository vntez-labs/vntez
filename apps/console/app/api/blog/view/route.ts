import { NextResponse } from "next/server";
import { getStoredBlogPosts, saveStoredBlogPosts } from "@/lib/storage-content";

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Thiếu slug bài viết" }, { status: 400 });
    }

    const posts = await getStoredBlogPosts();
    const target = posts.find((p) => p.slug === slug);
    if (!target) {
      return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    }

    target.viewsCount = (target.viewsCount || 0) + 1;
    await saveStoredBlogPosts(posts);

    return NextResponse.json({
      success: true,
      viewsCount: target.viewsCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi cập nhật view" }, { status: 500 });
  }
}
