import { NextRequest, NextResponse } from "next/server";
import { insertNote, NOTE_COLORS } from "@/lib/notes";

export const dynamic = "force-dynamic";

const ALLOWED = new Set<string>(NOTE_COLORS);

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const rec = body as Record<string, unknown>;
  if (clean(rec.website)) {
    return NextResponse.json({ ok: true, note: null });
  }

  const message = clean(rec.message);
  const name = clean(rec.name) || "Anonymous";
  const color = clean(rec.color) || "cream";

  if (message.length < 1 || message.length > 240) {
    return NextResponse.json({ error: "Message must be 1–240 characters." }, { status: 400 });
  }
  if (name.length > 40) {
    return NextResponse.json({ error: "Name is too long." }, { status: 400 });
  }
  if (!ALLOWED.has(color)) {
    return NextResponse.json({ error: "Invalid color." }, { status: 400 });
  }

  const res = await insertNote({ message, name, color });
  if (res.error) return NextResponse.json({ error: res.error }, { status: 500 });
  return NextResponse.json({ ok: true, note: res.note });
}
