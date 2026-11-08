export interface AppLegalPolicies {
  privacyPolicyMdx?: string;
  termsOfServiceMdx?: string;
  updatedAt?: string;
}

export interface AppDocPage {
  slug: string;
  title: string;
  category?: string;
  content: string;
  order?: number;
  updatedAt?: string;
}

export interface AppLegalDocument {
  slug: string;
  title: string;
  version?: string;
  effectiveDate?: string;
  content: string;
  updatedAt?: string;
}

export interface AppRole {
  id: string;
  name: string;
  description?: string;
  isSystem?: boolean;
}

export interface AppItem {
  id: string;
  name: string;
  description: string;
  url?: string | null; // Live website URL (hoặc null nếu chưa có)
  category?: string;
  releaseDate?: string;
  platforms: string[];
  color?: string;
  ctaLink?: string;
  avatarUrl?: string | null;
  illustrationKey?: "storage" | "security" | "offline" | "supply-chain" | "telemetry" | "ecosystem" | "iam" | "sdk";
  status: "active" | "draft";
  updatedAt: string;

  // Consolidated OAuth 2.0 Credentials & Scopes
  clientId?: string;
  clientSecret?: string;
  redirectUris?: string[];
  isInternal?: boolean;

  // Scoped RBAC Permissions Matrix per App
  roles?: AppRole[];
  resources?: string[];
  rolePermissions?: Record<string, string[]>;
  customPermissions?: string[];

  // Multi-page Docs (MDX)
  docsPages?: AppDocPage[];
  docsMdx?: string;

  // Multi-page Legal Policies (MDX)
  legalDocuments?: AppLegalDocument[];
  legal?: AppLegalPolicies;

  // Remote Config (Feature flags & runtime settings per app)
  remoteConfig?: Record<string, unknown>;
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
