import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { getBlogSummaries } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [content, posts] = await Promise.all([getContent(), getBlogSummaries()]);
  const pages = ["", "/about-us", "/playground", "/blog", "/contact"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
  const studies = content.caseStudies.filter((study) => study.published).map((study) => ({
    url: `${SITE_URL}/playground/${study.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  const articles = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...pages, ...studies, ...articles];
}
