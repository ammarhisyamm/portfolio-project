import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { formatPostDate, getBlogSummaries, DEFAULT_SUBSTACK } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Personal essays from Hisyam on life, growth, and the small things worth noticing.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogSummaries();
  const [lead, ...rest] = posts;
  return (
    <div className="grid gap-3 pb-16 pt-3 md:gap-4">
      <Reveal className="panel grid gap-5 p-5 sm:p-8 lg:p-10">
        <span className="kicker">Blog</span>
        <h1 className="max-w-[820px] text-[clamp(26px,4vw,32px)] font-normal leading-[1.08] tracking-[-0.05em]">
          Notes on life, growth, and the things in between.
        </h1>
        <p className="max-w-[560px] leading-relaxed text-sub">
          Essays and field notes, also published on{" "}
          <a href={DEFAULT_SUBSTACK} target="_blank" rel="noreferrer" className="text-ink">Substack</a>.
        </p>
      </Reveal>

      {lead ? (
        <Reveal className="panel overflow-hidden p-0">
          <Link href={`/blog/${lead.slug}`} className="blog-lead group grid no-underline sm:grid-cols-[1.1fr_1fr]">
            {lead.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={lead.cover} alt="" className="aspect-[16/10] h-full w-full object-cover" fetchPriority="high" />
            )}
            <div className="grid content-end gap-3 p-5 sm:p-8">
              <span className="text-[11px] uppercase text-muted">{[formatPostDate(lead.date), `${lead.readingMinutes} min read`].filter(Boolean).join(" · ")}</span>
              <h2 className="text-[clamp(22px,2.6vw,28px)] font-normal leading-tight tracking-[-0.04em] group-hover:text-sub">{lead.title}</h2>
              {lead.subtitle && <p className="leading-relaxed text-sub">{lead.subtitle}</p>}
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

      {rest.length > 0 && (
        <Reveal className="panel p-5 sm:p-8">
          <span className="kicker">All articles</span>
          <ul className="mt-6 border-t border-line">
            {rest.map((post) => (
              <li key={post.slug} className="border-b border-line">
                <Link href={`/blog/${post.slug}`} className="group grid gap-1 py-4 no-underline sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6">
                  <span>
                    <span className="block text-[15px] font-medium group-hover:text-sub">{post.title}</span>
                    {post.subtitle && <span className="mt-1 block text-sm leading-relaxed text-sub">{post.subtitle}</span>}
                  </span>
                  <span className="text-[11px] uppercase text-muted">{formatPostDate(post.date)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </div>
  );
}
