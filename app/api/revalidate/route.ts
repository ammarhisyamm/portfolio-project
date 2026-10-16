import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/** Called by the CMS after a save so changes show immediately instead of within a minute. */
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  revalidateTag("blog");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidated: true });
}
