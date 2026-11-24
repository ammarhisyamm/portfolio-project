"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type ShelfArticle = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readingMinutes: number;
};

const jackets = [
  ["#174744", "#dfeb9f"],
  ["#ad4837", "#fff2df"],
  ["#31593a", "#fffae5"],
  ["#303956", "#fff2ce"],
  ["#eac76b", "#382c1a"],
  ["#653e52", "#ffe9de"],
  ["#b9c8de", "#26354c"],
  ["#e8d1bf", "#452b27"],
];

const BOOKS_PER_SHELF = 6;

function Shelf({ articles, colorOffset }: { articles: ShelfArticle[]; colorOffset: number }) {
  const [selected, setSelected] = useState(0);
  const current = articles[selected];

  return (
    <div className="blog-shelf">
      <ul className="blog-shelf-books" aria-label="Article covers">
        {articles.map((article, index) => {
          const [cloth, ink] = jackets[(colorOffset - index + jackets.length) % jackets.length];
          const active = selected === index;
          const colors = { "--book-cloth": cloth, "--book-ink": ink } as CSSProperties;
          return (
            <li key={article.slug} className="blog-book-slot" data-active={active} style={colors}>
              <button
                type="button"
                className="blog-book"
                aria-label={article.title}
                aria-pressed={active}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setSelected(index);
                }}
                onFocus={() => setSelected(index)}
                onClick={() => setSelected(index)}
              >
                <span className="blog-book-spine" aria-hidden="true">
                  <span>{article.title}</span>
                </span>
                <span className="blog-book-cover" aria-hidden="true">
                  <span className="blog-book-title">{article.title}</span>
                  <span className="blog-book-author">Hisyam Fakhrudin</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="blog-shelf-caption">
        <p className="kicker">{[current.date, `${current.readingMinutes} min read`].filter(Boolean).join(" · ")}</p>
        <h3 className="t-h3">{current.title}</h3>
        {current.subtitle && <p className="t-lede">{current.subtitle}</p>}
        <Link className="link-arrow w-fit" href={`/blog/${current.slug}`} aria-label={`Read article: ${current.title}`}>
          Read article <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function BlogBookshelf({ articles }: { articles: ShelfArticle[] }) {
  return Array.from({ length: Math.ceil(articles.length / BOOKS_PER_SHELF) }, (_, shelf) => {
    const start = shelf * BOOKS_PER_SHELF;
    const row = articles.slice(start, start + BOOKS_PER_SHELF);
    return <Shelf key={row[0].slug} articles={row} colorOffset={(articles.length - 1 - start) % jackets.length} />;
  });
}
