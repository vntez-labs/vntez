import { getSupabaseAdminClient } from "./supabase";
import type { BlogPostItem, BlogComment } from "@workspace/ui/lib/content-types";

export async function getLiveBlogPosts(): Promise<BlogPostItem[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      return data.map((r) => ({
        slug: String(r.slug),
        title: String(r.title || ""),
        excerpt: String(r.excerpt || ""),
        content: String(r.content || ""),
        category: String(r.category || ""),
        color: typeof r.color === "string" ? r.color : "#fb291a",
        author: String(r.author || ""),
        date: String(r.date || ""),
        readTime: String(r.read_time || "5 phút đọc"),
        commentsCount: typeof r.comments_count === "number" ? r.comments_count : 0,
        likesCount: typeof r.likes_count === "number" ? r.likes_count : 0,
        viewsCount: typeof r.views_count === "number" ? r.views_count : 0,
        illustrationKey: typeof r.illustration_key === "string" ? r.illustration_key : undefined,
        thumbnailUrl: typeof r.thumbnail_url === "string" ? r.thumbnail_url : undefined,
        status: (r.status as BlogPostItem["status"]) || "published",
        comments: Array.isArray(r.comments) ? (r.comments as BlogComment[]) : [],
        updatedAt: typeof r.updated_at === "string" ? r.updated_at : new Date().toISOString(),
      }));
    }
  } catch (err) {
    console.error("Error reading blog posts from Supabase:", err);
  }
  return [];
}

export async function saveLiveBlogPosts(posts: BlogPostItem[]): Promise<boolean> {
  try {
    const supabase = getSupabaseAdminClient();
    if (posts.length > 0) {
      const records = posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        category: p.category,
        color: p.color,
        author: p.author,
        date: p.date,
        read_time: p.readTime,
        comments_count: p.commentsCount || 0,
        likes_count: p.likesCount || 0,
        views_count: p.viewsCount || 0,
        illustration_key: p.illustrationKey,
        thumbnail_url: p.thumbnailUrl,
        status: p.status,
        comments: p.comments || [],
        updated_at: new Date().toISOString(),
      }));
      const { error } = await supabase.from("blog_posts").upsert(records);
      if (!error) return true;
    }
    return true;
  } catch (err) {
    console.error("Error saving blog posts in Supabase:", err);
    return false;
  }
}

export async function incrementView(slug: string): Promise<number> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data: current } = await supabase
      .from("blog_posts")
      .select("views_count")
      .eq("slug", slug)
      .maybeSingle();

    if (!current) return 0;

    const newViews = (current.views_count || 0) + 1;
    await supabase
      .from("blog_posts")
      .update({ views_count: newViews, updated_at: new Date().toISOString() })
      .eq("slug", slug);

    return newViews;
  } catch (err) {
    console.error("Error incrementing view in Supabase:", err);
    return 0;
  }
}

export async function toggleLike(
  slug: string,
  action: "like" | "unlike" = "like"
): Promise<number> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data: current } = await supabase
      .from("blog_posts")
      .select("likes_count")
      .eq("slug", slug)
      .maybeSingle();

    if (!current) return 0;

    const currentLikes = current.likes_count || 0;
    const newLikes =
      action === "unlike" ? Math.max(0, currentLikes - 1) : currentLikes + 1;

    await supabase
      .from("blog_posts")
      .update({ likes_count: newLikes, updated_at: new Date().toISOString() })
      .eq("slug", slug);

    return newLikes;
  } catch (err) {
    console.error("Error toggling like in Supabase:", err);
    return 0;
  }
}

export async function incrementLike(slug: string): Promise<number> {
  return toggleLike(slug, "like");
}

export async function addComment(
  slug: string,
  author: string,
  content: string,
  parentId?: string | null,
  replyToAuthor?: string,
  avatar?: string
): Promise<{ comment: BlogComment; count: number } | null> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data: current, error } = await supabase
      .from("blog_posts")
      .select("comments, comments_count")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !current) {
      console.warn(`Post with slug "${slug}" not found in Supabase:`, error);
      return null;
    }

    const newComment: BlogComment = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      parentId: parentId || null,
      replyToAuthor: replyToAuthor?.trim() || undefined,
      author: author.trim(),
      avatar: avatar?.trim() || undefined,
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likesCount: 0,
    };

    const existingComments: BlogComment[] = Array.isArray(current.comments)
      ? (current.comments as BlogComment[])
      : [];

    const updatedComments = [newComment, ...existingComments];
    const newCount = updatedComments.length;

    const { error: updateError } = await supabase
      .from("blog_posts")
      .update({
        comments: updatedComments,
        comments_count: newCount,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug);

    if (updateError) {
      console.error("Error updating comments in Supabase:", updateError);
      return null;
    }

    return { comment: newComment, count: newCount };
  } catch (err) {
    console.error("Error adding comment in Supabase:", err);
    return null;
  }
}

export async function deleteComment(
  slug: string,
  commentId: string
): Promise<{ success: boolean; count: number }> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data: current, error } = await supabase
      .from("blog_posts")
      .select("comments, comments_count")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !current) return { success: false, count: 0 };

    const existingComments: BlogComment[] = Array.isArray(current.comments)
      ? (current.comments as BlogComment[])
      : [];

    const idsToDelete = new Set<string>([commentId]);
    existingComments.forEach((c) => {
      if (c.parentId && idsToDelete.has(c.parentId)) {
        idsToDelete.add(c.id);
      }
    });

    const filtered = existingComments.filter((c) => !idsToDelete.has(c.id));
    const newCount = filtered.length;

    await supabase
      .from("blog_posts")
      .update({
        comments: filtered,
        comments_count: newCount,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug);

    return { success: true, count: newCount };
  } catch (err) {
    console.error("Error deleting comment in Supabase:", err);
    return { success: false, count: 0 };
  }
}
