export interface AppItem {
  id: string;
  name: string;
  category: string;
  description: string;
  releaseDate?: string;
  platforms: string[];
  color: string;
  ctaLink: string;
  avatarUrl?: string | null;
  illustrationKey?: string;
  status: "active" | "draft";
  updatedAt: string;
}

export interface BlogComment {
  id: string;
  parentId?: string | null;
  replyToAuthor?: string;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
  likesCount?: number;
  replies?: BlogComment[];
}

export function buildCommentTree(comments?: BlogComment[]): BlogComment[] {
  if (!comments || !Array.isArray(comments)) return [];

  const map = new Map<string, BlogComment>();
  const roots: BlogComment[] = [];

  for (const c of comments) {
    map.set(c.id, { ...c, replies: [] });
  }

  for (const c of comments) {
    const node = map.get(c.id);
    if (!node) continue;

    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies!.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export interface BlogPostItem {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  color: string;
  author: string;
  date: string;
  readTime: string;
  commentsCount: number;
  likesCount: number;
  viewsCount: number;
  illustrationKey?: string;
  thumbnailUrl?: string | null;
  status: "published" | "draft";
  comments?: BlogComment[];
  updatedAt: string;
}
