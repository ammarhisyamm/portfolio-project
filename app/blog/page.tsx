import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import BlogBookshelf from "@/components/BlogBookshelf";
import { formatPostDate, getBlogSummaries, DEFAULT_SUBSTACK } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Essays | Ammar Hisyam Fakhrudin",
  description: "Reflections on faith, growth, and everyday life, in English and Indonesian.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getBlogSummaries();
  return (
    <section className="min-w-0 px-2 pb-16 pt-10 text-left sm:px-8 sm:pt-14" aria-labelledby="all-articles">
      <h1 id="all-articles" className="scroll-mt-28 text-base font-semibold tracking-tight">All articles</h1>
      {posts.length > 0 ? (
        <BlogBookshelf articles={posts.map(({ slug, title, subtitle, date, readingMinutes }) => ({
          slug, title, subtitle, date: formatPostDate(date), readingMinutes,
        }))} />
      ) : (
        <p className="mt-5 text-sm text-sub">
          New articles will appear here soon. Meanwhile, read them on{" "}
          <a href={DEFAULT_SUBSTACK} target="_blank" rel="noreferrer">Substack <ArrowUpRight size={13} className="inline" /></a>.
        </p>
      )}
    </section>
  );
}
