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
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
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
