"use client";

import { ArrowUpRight, ArrowUp } from "lucide-react";
import type { FooterContent } from "@/lib/content";

export default function SiteFooter({ footer }: { footer: FooterContent }) {
  return (
    <footer className="panel mb-9 mt-3 grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.4fr_auto] lg:gap-14 lg:p-10">
      <div>
        <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.02em] text-sub">
          {footer.note}
        </p>
        <h2 className="text-[clamp(24px,4vw,32px)] font-normal leading-[1.1] tracking-[-0.05em]">
          <a
            href={`mailto:${footer.email}`}
            className="group inline-flex items-center gap-2.5 no-underline"
          >
            {footer.heading}
            <ArrowUpRight
              size={24}
              className="inline-block text-muted transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
              aria-hidden="true"
            />
          </a>
        </h2>
      </div>
      <div className="flex flex-col items-start lg:justify-self-end">
        <a href={`mailto:${footer.email}`} className="py-1.5 text-[13px] text-sub no-underline hover:text-ink">
          {footer.email}
        </a>
        {footer.links.map((link) => (
          <a key={link.label} href={link.href} className="py-1.5 text-[13px] text-sub no-underline hover:text-ink">
            {link.label}
          </a>
        ))}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-4 text-xs text-muted underline underline-offset-4 hover:text-ink"
        >
          Back to top <ArrowUp size={11} className="inline" aria-hidden="true" />
        </button>
      </div>
      <small className="border-t border-line pt-4 font-mono text-[10px] uppercase tracking-[0.04em] text-muted lg:col-span-2">
        © {new Date().getFullYear()} Hisyam. Jakarta, Indonesia.
      </small>
    </footer>
  );
}