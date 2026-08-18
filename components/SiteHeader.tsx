"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[650px] items-center justify-between px-4 sm:px-0">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-[-0.03em] text-ink no-underline"
        >
          Hisyam
        </Link>

        <nav className="flex items-center gap-6" aria-label="Primary">
          {LINKS.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`text-[12px] uppercase tracking-[0.14em] no-underline transition-colors duration-200 ${
                  isActive ? "text-ink" : "text-muted hover:text-ink"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
