import { NextResponse } from "next/server";
import { formatPostDate, getBlogPost } from "@/lib/blog";

export const revalidate = 300;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ...post, dateLabel: formatPostDate(post.date) });
}
