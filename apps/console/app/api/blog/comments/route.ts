import { NextResponse } from "next/server";
import { getStoredBlogPosts, saveStoredBlogPosts } from "@/lib/storage-content";
import type { BlogComment } from "@workspace/ui/lib/content-types";

export async function POST(req: Request) {
  try {
    const { slug, author, content } = await req.json();
    if (!slug || !author || !content) {
      return NextResponse.json({ error: "Thiếu thông tin bình luận" }, { status: 400 });
    }

    const posts = await getStoredBlogPosts();
    const target = posts.find((p) => p.slug === slug);
    if (!target) {
      return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    }

    const newComment: BlogComment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      author: author.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(target.comments)) {
      target.comments = [];
    }

    target.comments.unshift(newComment);
    target.commentsCount = target.comments.length;

    await saveStoredBlogPosts(posts);

    return NextResponse.json({
      success: true,
      comment: newComment,
      commentsCount: target.commentsCount,
      comments: target.comments,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi gửi bình luận" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const commentId = searchParams.get("commentId");

    if (!slug || !commentId) {
      return NextResponse.json({ error: "Thiếu slug hoặc commentId" }, { status: 400 });
    }

    const posts = await getStoredBlogPosts();
    const target = posts.find((p) => p.slug === slug);
    if (!target) {
      return NextResponse.json({ error: "Không tìm thấy bài viết" }, { status: 404 });
    }

    target.comments = (target.comments || []).filter((c) => c.id !== commentId);
    target.commentsCount = target.comments.length;

    await saveStoredBlogPosts(posts);

    return NextResponse.json({
      success: true,
      commentsCount: target.commentsCount,
      comments: target.comments,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi xóa bình luận" }, { status: 500 });
  }
}
