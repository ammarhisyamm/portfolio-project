"use client";

import { ArrowUpRight, ArrowUp } from "lucide-react";
import type { FooterContent } from "@/lib/content";

export default function SiteFooter({ footer }: { footer: FooterContent }) {
  return (
    <footer className="mx-auto w-full max-w-[650px] border-t border-line">
      <div className="grid gap-10 py-16 sm:grid-cols-2 sm:py-20">
        <div>
          <p className="text-[13px] text-sub">{footer.note}</p>
          <h2 className="mt-4 text-[26px] font-medium tracking-[-0.03em] leading-tight text-ink">
            {footer.heading}
          </h2>
          <a
            href={`mailto:${footer.email}`}
            className="group mt-4 inline-flex items-center gap-1.5 text-[15px] text-ink no-underline hover:text-sub"
          >
            {footer.email}
            <ArrowUpRight
              size={15}
              className="text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          {footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="inline-flex items-center gap-1.5 py-1 text-[13px] text-sub no-underline transition-colors hover:text-ink"
            >
              {link.label}
              <ArrowUpRight size={13} className="text-muted" aria-hidden="true" />
            </a>
          ))}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted no-underline transition-colors hover:text-ink"
          >
            Back to top
            <ArrowUp size={11} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line py-6">
        <small className="text-[11px] uppercase tracking-[0.12em] text-muted">
          © {new Date().getFullYear()} Hisyam
        </small>
        <small className="text-[11px] uppercase tracking-[0.12em] text-muted">
          Jakarta, Indonesia
        </small>
      </div>
    </footer>
  );
}
