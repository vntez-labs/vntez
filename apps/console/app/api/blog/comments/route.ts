import { NextResponse } from "next/server";
import { getStoredBlogPosts, saveStoredBlogPosts } from "@/lib/storage-content";
import type { BlogComment } from "@workspace/ui/lib/content-types";

export async function POST(req: Request) {
  try {
    const { slug, author, content, parentId, replyToAuthor, avatar } = await req.json();
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
      parentId: parentId || null,
      replyToAuthor: replyToAuthor?.trim() || undefined,
      author: author.trim(),
      avatar: avatar?.trim() || undefined,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likesCount: 0,
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
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi gửi bình luận";
    return NextResponse.json({ error: msg }, { status: 500 });
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

    const idsToDelete = new Set<string>([commentId]);
    (target.comments || []).forEach((c) => {
      if (c.parentId && idsToDelete.has(c.parentId)) {
        idsToDelete.add(c.id);
      }
    });

    target.comments = (target.comments || []).filter((c) => !idsToDelete.has(c.id));
    target.commentsCount = target.comments.length;

    await saveStoredBlogPosts(posts);

    return NextResponse.json({
      success: true,
      commentsCount: target.commentsCount,
      comments: target.comments,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Lỗi xóa bình luận";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
