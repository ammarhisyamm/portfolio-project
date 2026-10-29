import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ReadingProgress from "@/components/ReadingProgress";
import { formatPostDate, getBlogPost, getBlogSummaries } from "@/lib/blog";
import { getContent } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getBlogSummaries()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.subtitle || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.subtitle || undefined, publishedTime: post.date || undefined, images: post.cover ? [post.cover] : undefined },
    twitter: { card: post.cover ? "summary_large_image" : "summary", title: post.title, description: post.subtitle || undefined, images: post.cover ? [post.cover] : undefined },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, summaries, content] = await Promise.all([getBlogPost(slug), getBlogSummaries(), getContent()]);
  if (!post) notFound();
  const index = summaries.findIndex((item) => item.slug === post.slug);
  const next = summaries[index + 1];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.subtitle || undefined,
    datePublished: post.date || undefined,
    image: post.cover || undefined,
    author: { "@type": "Person", name: content.hero.name },
    mainEntityOfPage: `/blog/${post.slug}`,
    ...(post.url ? { sameAs: post.url } : {}),
  };
  return (
    <article lang={/menerima-diri|menikmati|hal-kecil|mengapresiasi|mengelola-ego/i.test(post.slug) ? "id" : "en"} className="grid gap-3 pb-16 pt-3 md:gap-4">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="panel grid gap-5 p-5 sm:p-8 lg:p-10">
        <Link href="/blog" className="inline-flex w-fit items-center gap-2 text-[13px] text-sub no-underline hover:text-ink">
          <ArrowLeft size={14} aria-hidden="true" /> All articles
        </Link>
        <span className="text-[11px] uppercase text-muted">{formatPostDate(post.date)}</span>
        <h1 className="text-[clamp(28px,4.4vw,40px)] font-normal leading-[1.06] tracking-[-0.05em]">{post.title}</h1>
        {post.subtitle && <p className="max-w-[600px] text-[17px] leading-relaxed text-sub">{post.subtitle}</p>}
        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt="" className="mt-2 w-full rounded-[12px] object-cover" fetchPriority="high" />
        )}
      </header>
      <div className="panel p-5 sm:p-8 lg:p-10">
        {post.body ? (
          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.body }} />
        ) : (
          <p className="text-sub">This article lives on Substack.</p>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          {post.url && (
            <a href={post.url} target="_blank" rel="noreferrer" className="btn btn-secondary">
              Read on Substack <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
          {next && (
            <Link href={`/blog/${next.slug}`} className="text-[13px] text-sub no-underline hover:text-ink">
              Next: {next.title}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
