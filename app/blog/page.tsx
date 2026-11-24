import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import BlogBookshelf from "@/components/BlogBookshelf";
import { formatPostDate, getBlogSummaries, DEFAULT_SUBSTACK } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Essays | Ammar Hisyam Fakhrudin",
  description: "Reflections on faith, growth, and everyday life, in English and Indonesian.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogSummaries();
  const [lead] = posts;
  return (
    <div className="grid gap-4 pb-16 pt-3 sm:gap-5">
      <Reveal className="panel grid gap-5 p-5 sm:p-8">
        <span className="kicker">Personal essays</span>
        <h1 className="t-display max-w-[760px]">
          Reflections on faith, growth, and everyday life.
        </h1>
        <p className="t-lede">
          In English and Indonesian, also published on{" "}
          <a href={DEFAULT_SUBSTACK} target="_blank" rel="noreferrer" className="text-ink">Substack</a>.
        </p>
      </Reveal>

      {lead ? (
        <Reveal className="panel p-5 sm:p-8">
          <Link href={`/blog/${lead.slug}`} className={`blog-lead group grid min-w-0 items-center gap-4 no-underline sm:gap-6 ${lead.cover ? "md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" : ""}`}>
            {lead.cover && (
              <div className="overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={lead.cover} alt="" className="aspect-[3/2] w-full object-cover" fetchPriority="high" />
              </div>
            )}
            <div className="grid min-w-0 gap-2.5">
              <span className="text-[11px] uppercase text-muted">{[formatPostDate(lead.date), `${lead.readingMinutes} min read`].filter(Boolean).join(" · ")}</span>
              <h2 className="text-pretty text-[clamp(20px,2.8vw,26px)] font-semibold leading-tight tracking-[-0.03em] group-hover:text-sub">{lead.title}</h2>
              {lead.subtitle && <p className="text-pretty text-[15px] leading-relaxed text-sub">{lead.subtitle}</p>}
            </div>
          </Link>
        </Reveal>
      ) : (
        <Reveal className="panel p-5 sm:p-8">
          <p className="text-sub">
            New articles will appear here soon. Meanwhile, read them on{" "}
            <a href={DEFAULT_SUBSTACK} target="_blank" rel="noreferrer">Substack <ArrowUpRight size={13} className="inline" /></a>.
          </p>
        </Reveal>
      )}

      {posts.length > 0 && (
        <section className="panel min-w-0 p-5 sm:p-8" aria-labelledby="all-articles">
          <h2 id="all-articles" className="t-title">All articles</h2>
          <BlogBookshelf articles={posts.map(({ slug, title, subtitle, date, readingMinutes }) => ({
            slug, title, subtitle, date: formatPostDate(date), readingMinutes,
          }))} />
        </section>
      )}
    </div>
  );
}
