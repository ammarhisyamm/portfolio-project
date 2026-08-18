"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Clock from "./Clock";
import Socials from "./Socials";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-3 z-40 mt-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-[18px] border border-line bg-panel px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.05em] no-underline"
          >
            <span className="grid h-8 w-8 place-items-center rounded-[10px] border border-line bg-bg text-[13px] text-ink">
              H
            </span>
            <span>
              Hisyam<span className="text-muted">.</span>
            </span>
          </Link>
          <Clock />
        </div>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {LINKS.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative pb-1 text-[13px] no-underline transition-opacity ${
                  isActive ? "font-medium text-ink" : "text-sub hover:text-ink"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
                {isActive && <span className="absolute inset-x-0.5 bottom-0 h-px bg-ink" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden md:block">
            <Socials />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line transition-colors hover:bg-bg md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden md:hidden"
          >
            <div className="mt-2 flex flex-col rounded-[18px] border border-line bg-panel p-2.5">
              {LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-[12px] border-b border-line px-3 py-3.5 text-base last:border-0 hover:bg-bg"
                >
                  {label}
                </Link>
              ))}
              <div className="flex items-center justify-between px-3 pt-3.5">
                <Socials />
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}