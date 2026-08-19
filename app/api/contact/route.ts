import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const TO = process.env.RESEND_TO || "ammarhisyam151@gmail.com";
const FROM = process.env.RESEND_FROM || "onboarding@resend.dev";

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const rec = body as Record<string, unknown>;
  if (clean(rec.company)) {
    return NextResponse.json({ ok: true, sent: false });
  }

  const name = clean(rec.name);
  const email = clean(rec.email);
  const projectType = clean(rec.projectType);
  const message = clean(rec.message);

  if (!name || name.length > 80) return NextResponse.json({ error: "Name wajib diisi." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
  if (!projectType || projectType.length > 60) return NextResponse.json({ error: "Pilih tipe proyek." }, { status: 400 });
  if (message.length < 10 || message.length > 5000) return NextResponse.json({ error: "Pesan 10–5000 karakter." }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "RESEND_API_KEY belum di-set." }, { status: 500 });

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: email,
    subject: `Portfolio inquiry — ${projectType}`,
    text: `${message}\n\n— ${name}\n${email}`,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, sent: true });
}