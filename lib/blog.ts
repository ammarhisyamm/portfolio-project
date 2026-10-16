import { cache } from "react";
import { createClient } from "@supabase/supabase-js";

export type BlogPost = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  cover: string;
  url: string;
  body: string;
  published: boolean;
};

export type BlogSummary = Omit<BlogPost, "body" | "published"> & { readingMinutes: number };

export type BlogSettings = {
  substackUrl: string;
  syncSubstack: boolean;
  posts: BlogPost[];
};

export const DEFAULT_SUBSTACK = "https://hisyamfakhrudin.substack.com";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase = supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null;

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function decode(value: string) {
  return value
    .replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&")
    .trim();
}

function tag(item: string, name: string) {
  const match = item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  return match ? decode(match[1].trim()) : "";
}

export function slugFromUrl(url: string) {
  const match = url.match(/\/p\/([^/?#]+)/);
  return match ? match[1] : url.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

/** Reads a Substack RSS feed into posts. Substack's feed carries the full article HTML. */
export function parseSubstackFeed(xml: string): BlogPost[] {
  return Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).map(([, item]) => {
    const url = tag(item, "link");
    const date = new Date(tag(item, "pubDate"));
    return {
      slug: slugFromUrl(url),
      title: tag(item, "title"),
      subtitle: tag(item, "description"),
      date: Number.isNaN(date.getTime()) ? "" : date.toISOString(),
      cover: item.match(/<enclosure[^>]*url="([^"]+)"/)?.[1] ?? "",
      url,
      body: tag(item, "content:encoded"),
      published: true,
    };
  }).filter((post) => post.title && post.slug);
}

/** Article HTML comes from Substack or the CMS; drop anything that can run code. */
export function sanitizeHtml(html: string) {
  return html
    .replace(/<(script|style|iframe|object|embed|form|noscript|template)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|style|iframe|object|embed|form|input|button|link|meta)\b[^>]*\/?>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(href|src|xlink:href|action|formaction)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi, "")
    .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, "");
}

/** Substack repeats the cover photo at the top of the body; the page already shows the cover, so drop that first copy. */
function imageKey(url: string) {
  try {
    return decodeURIComponent(url).split("?")[0].split("/").pop() ?? "";
  } catch {
    return "";
  }
}

function dropCoverCopy(html: string, cover: string) {
  const key = imageKey(cover);
  const image = /<img\b[^>]*>/i.exec(html);
  const src = image?.[0].match(/\ssrc="([^"]+)"/)?.[1];
  if (!key || !image || !src || imageKey(src) !== key) return html;
  const figure = /<figure\b[\s\S]*?<\/figure>/i.exec(html);
  const block = figure && figure.index <= image.index ? figure : image;
  let start = block.index;
  let end = block.index + block[0].length;
  // Substack wraps the figure in a container div; take that too so no empty gap is left behind.
  const before = html.slice(0, start).match(/<div class="captioned-image-container">\s*$/i);
  const after = html.slice(end).match(/^\s*<\/div>/i);
  if (before && after) {
    start -= before[0].length;
    end += after[0].length;
  }
  return html.slice(0, start) + html.slice(end);
}

function readingMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function asSettings(value: unknown): BlogSettings {
  const v = (value ?? {}) as Partial<BlogSettings>;
  const posts = Array.isArray(v.posts) ? v.posts : [];
  return {
    substackUrl: text(v.substackUrl) || DEFAULT_SUBSTACK,
    syncSubstack: v.syncSubstack !== false,
    posts: posts.map((post) => ({
      slug: text(post?.slug) || slugFromUrl(text(post?.url) || text(post?.title)),
      title: text(post?.title),
      subtitle: text(post?.subtitle),
      date: text(post?.date),
      cover: text(post?.cover),
      url: text(post?.url),
      body: text(post?.body),
      published: post?.published !== false,
    })).filter((post) => post.title && post.slug),
  };
}

async function readSettings(): Promise<BlogSettings> {
  if (!supabase) return asSettings(null);
  try {
    const { data, error } = await supabase.from("site_content").select("value").eq("key", "blog").maybeSingle();
    if (error) return asSettings(null);
    return asSettings(data?.value);
  } catch {
    return asSettings(null);
  }
}

async function readFeed(substackUrl: string): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${substackUrl.replace(/\/$/, "")}/feed`, {
      next: { revalidate: 3600, tags: ["blog"] },
      headers: { "User-Agent": "hisyamdesign-portfolio/1.0" },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    return parseSubstackFeed(await res.text());
  } catch {
    return [];
  }
}

/** CMS posts win over the Substack feed when both carry the same slug; hidden CMS posts stay hidden. */
export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const settings = await readSettings();
  const feed = settings.syncSubstack ? await readFeed(settings.substackUrl) : [];
  const bySlug = new Map<string, BlogPost>();
  for (const post of feed) bySlug.set(post.slug, post);
  for (const post of settings.posts) {
    const fromFeed = bySlug.get(post.slug);
    bySlug.set(post.slug, fromFeed ? { ...fromFeed, ...Object.fromEntries(Object.entries(post).filter(([, value]) => value !== "")) } as BlogPost : post);
  }
  return Array.from(bySlug.values())
    .filter((post) => post.published)
    .map((post) => ({ ...post, body: dropCoverCopy(sanitizeHtml(post.body), post.cover) }))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
});

export const getBlogSummaries = cache(async (): Promise<BlogSummary[]> =>
  (await getBlogPosts()).map(({ body, published: _published, ...post }) => ({ ...post, readingMinutes: readingMinutes(body) })),
);

export async function getBlogPost(slug: string) {
  return (await getBlogPosts()).find((post) => post.slug === slug) ?? null;
}

export function formatPostDate(date: string) {
  if (!date) return "";
  const value = new Date(date);
  return Number.isNaN(value.getTime()) ? "" : value.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Jakarta" });
}
