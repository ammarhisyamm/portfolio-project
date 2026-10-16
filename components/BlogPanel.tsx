import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { formatPostDate, type BlogSummary } from "@/lib/blog";

export default function BlogPanel({ posts }: { posts: BlogSummary[] }) {
  if (!posts.length) return null;
  return (
    <Reveal className="panel p-5 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <span className="kicker">From the blog</span>
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-[13px] text-sub no-underline hover:text-ink">
          All articles <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
      <ul className="mt-6 border-t border-line">
        {posts.slice(0, 3).map((post) => (
          <li key={post.slug} className="border-b border-line">
            <Link href={`/blog/${post.slug}`} className="group flex items-center gap-4 py-4 no-underline">
              {post.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.cover} alt="" loading="lazy" decoding="async" className="h-14 w-20 shrink-0 rounded-[8px] object-cover" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium leading-snug group-hover:text-sub">{post.title}</span>
                <span className="mt-1 block text-[11px] uppercase text-muted">{[formatPostDate(post.date), `${post.readingMinutes} min read`].filter(Boolean).join(" · ")}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
