"use client";

import { ArrowUpRight, ArrowUp } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="panel mb-9 mt-4 grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.4fr_auto] lg:gap-14">
      <div>
        <p className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.02em] text-sub">
          Have a thoughtful problem to solve?
        </p>
        <h2 className="text-[clamp(30px,4vw,52px)] font-normal leading-none tracking-[-0.06em]">
          <a
            href="mailto:hello@hisyam.design"
            className="group inline-flex items-baseline gap-2 no-underline"
          >
            Let&rsquo;s work together
            <ArrowUpRight
              size={32}
              className="inline-block text-muted transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
              aria-hidden="true"
            />
          </a>
        </h2>
      </div>
      <div className="flex flex-col items-start lg:justify-self-end">
        <a href="mailto:hello@hisyam.design" className="py-1.5 text-[13px] text-sub no-underline hover:text-ink">
          hello@hisyam.design
        </a>
        <a href="#" className="py-1.5 text-[13px] text-sub no-underline hover:text-ink">
          LinkedIn
        </a>
        <a href="#" className="py-1.5 text-[13px] text-sub no-underline hover:text-ink">
          Behance
        </a>
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