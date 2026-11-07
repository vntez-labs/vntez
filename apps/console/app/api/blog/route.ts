import { NextResponse } from "next/server";
import { getServerSession } from "@workspace/auth/server";
import { getStoredBlogPosts, saveStoredBlogPosts } from "@/lib/storage-content";
import type { BlogPostItem } from "@workspace/ui/lib/content-types";

export async function GET() {
  const posts = await getStoredBlogPosts();
  return NextResponse.json({ success: true, posts });
}

export async function POST(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, excerpt, content, category, author, readTime, color, illustrationKey, thumbnailUrl, status } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Tiêu đề và nội dung Markdown là bắt buộc" }, { status: 400 });
    }

    const slug = body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const posts = await getStoredBlogPosts();

    const existingIndex = posts.findIndex((p) => p.slug === slug);
    if (existingIndex !== -1) {
      posts[existingIndex] = {
        ...posts[existingIndex],
        ...body,
        slug,
        title: title.trim(),
        excerpt: excerpt?.trim() || title.trim(),
        content: content.trim(),
        category: category?.trim() || "Kỹ thuật & Kiến trúc",
        color: color || "#fb291a",
        author: author?.trim() || (user.name || "Engineering Team"),
        readTime: readTime || `${Math.max(2, Math.round(content.split(/\s+/).length / 200))} phút đọc`,
        illustrationKey: illustrationKey || "ecosystem",
        thumbnailUrl: thumbnailUrl || null,
        status: status === "draft" ? "draft" : "published",
        updatedAt: new Date().toISOString(),
      };
      const saved = await saveStoredBlogPosts(posts);
      if (!saved) throw new Error("Lưu bài viết thất bại");
      return NextResponse.json({ success: true, post: posts[existingIndex] });
    }

    const newPost: BlogPostItem = {
      slug,
      title: title.trim(),
      excerpt: excerpt?.trim() || title.trim(),
      content: content.trim(),
      category: category?.trim() || "Kỹ thuật & Kiến trúc",
      color: color || "#fb291a",
      author: author?.trim() || (user.name || "Engineering Team"),
      date: new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }),
      readTime: readTime || `${Math.max(2, Math.round(content.split(/\s+/).length / 200))} phút đọc`,
      commentsCount: 0,
      likesCount: 0,
      viewsCount: 0,
      illustrationKey: illustrationKey || "ecosystem",
      thumbnailUrl: thumbnailUrl || null,
      status: status === "draft" ? "draft" : "published",
      comments: [],
      updatedAt: new Date().toISOString(),
    };

    posts.unshift(newPost);
    const saved = await saveStoredBlogPosts(posts);
    if (!saved) throw new Error("Lưu bài viết thất bại");

    return NextResponse.json({ success: true, post: newPost });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi tạo bài viết" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { slug, originalSlug } = body;
    const targetSlug = originalSlug || slug;
    if (!targetSlug && !slug) {
      return NextResponse.json({ error: "Thiếu slug bài viết" }, { status: 400 });
    }

    const posts = await getStoredBlogPosts();
    let index = posts.findIndex((p) => p.slug === targetSlug || p.slug === slug);
    if (index === -1) {
      const newPost: BlogPostItem = {
        ...body,
        slug: slug || targetSlug,
        updatedAt: new Date().toISOString(),
      };
      posts.unshift(newPost);
      index = 0;
    } else {
      posts[index] = {
        ...posts[index],
        ...body,
        slug: slug || targetSlug,
        updatedAt: new Date().toISOString(),
      };
    }

    const saved = await saveStoredBlogPosts(posts);
    if (!saved) throw new Error("Lưu bài viết thất bại");

    return NextResponse.json({ success: true, post: posts[index] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi cập nhật bài viết" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { user } = await getServerSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Thiếu slug bài viết" }, { status: 400 });
    }

    const posts = await getStoredBlogPosts();
    const filtered = posts.filter((p) => p.slug !== slug);
    const saved = await saveStoredBlogPosts(filtered);
    if (!saved) throw new Error("Xóa bài viết thất bại");

    return NextResponse.json({ success: true, slug });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Lỗi xóa bài viết" }, { status: 500 });
  }
}
