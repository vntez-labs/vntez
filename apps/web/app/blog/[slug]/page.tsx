import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconArrowLeft,
  IconCalendar,
  IconUser,
  IconClock,
} from "@tabler/icons-react";
import { fetchLiveBlogPostBySlug, fetchLiveBlogPosts } from "@workspace/ui/lib/content-service";
import { BlogInteractions } from "./components/blog-interactions";
import { BlogCommentsSection } from "./components/blog-comments-section";
import { BlogMarkdownReader } from "./components/blog-markdown-reader";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchLiveBlogPostBySlug(slug);
  if (!post) {
    return { title: "Không tìm thấy bài viết — vntez" };
  }

  const title = `${post.title} — vntez Engineering Blog`;
  const description = post.excerpt;
  const url = `https://vntez.net/blog/${slug}`;
  const images = post.thumbnailUrl
    ? [{ url: post.thumbnailUrl, width: 1200, height: 630, alt: post.title }]
    : [{ url: "https://vntez.net/vntez-logo.png", width: 800, height: 800, alt: "vntez" }];

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      locale: "vi_VN",
      url,
      siteName: "vntez Engineering Blog",
      title,
      description,
      publishedTime: post.date,
      authors: [post.author],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.thumbnailUrl ? [post.thumbnailUrl] : ["https://vntez.net/vntez-logo.png"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchLiveBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "VNTEZ LABS",
      logo: {
        "@type": "ImageObject",
        url: "https://vntez.net/icon.svg",
      },
    },
    image: post.thumbnailUrl || "https://vntez.net/vntez-logo.png",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://vntez.net/blog/${slug}`,
    },
  };

  return (
    <article className="mx-auto max-w-4xl px-6 pt-8 sm:pt-12 pb-20 sm:pb-28">
      {/* Structured Data for SEO / Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <IconArrowLeft className="size-4" />
          <span>Quay lại Blog</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4 pb-6 border-b border-slate-200/80 dark:border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-semibold uppercase tracking-wider bg-slate-100 dark:bg-[#131b2e] text-slate-700 dark:text-slate-300 shadow-2xs"
          >
            <span className="size-2 rounded-full" style={{ backgroundColor: post.color || "#fb291a" }} />
            {post.category}
          </span>
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <IconClock className="size-3.5" />
            <span>{post.readTime}</span>
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-sans pt-1">
          <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
            <IconUser className="size-4 opacity-60" />
            <span>{post.author}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5 font-mono">
            <IconCalendar className="size-4 opacity-60" />
            <span>{post.date}</span>
          </div>
        </div>
      </header>

      {/* Banner / Thumbnail if present */}
      {post.thumbnailUrl && (
        <div className="my-8 max-h-[500px] w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-[#0c121e] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-center p-2 sm:p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="max-h-[480px] w-auto max-w-full object-contain rounded-xl shadow-xs"
          />
        </div>
      )}

      {/* Article Body: Markdown Reader */}
      <div className="py-6">
        <BlogMarkdownReader content={post.content} />
      </div>

      {/* Interactive Actions (Likes, Views, Share) */}
      <BlogInteractions
        slug={post.slug}
        initialLikes={post.likesCount || 0}
        initialViews={post.viewsCount || 0}
      />

      {/* Discussion & Comments */}
      <BlogCommentsSection slug={post.slug} initialComments={post.comments || []} />
    </article>
  );
}
