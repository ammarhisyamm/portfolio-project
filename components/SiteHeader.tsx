"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Clock from "./Clock";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

const LOGO_SHADOW = "inset 0 0 0 2px rgba(255,255,255,0.9), 0 10px 24px -12px rgba(22,22,22,0.22)";

export default function SiteHeader({ logo }: { logo?: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-3 z-40 mt-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-[18px] border border-line bg-panel px-4 py-2.5 sm:px-5">
        <div className="flex items-center">
          <Link
            href="/"
            aria-label="Home"
            className="grid h-8 w-8 place-items-center overflow-hidden rounded-[10px] bg-bg no-underline"
            style={{ boxShadow: LOGO_SHADOW }}
          >
            {logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={logo} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[13px] font-semibold tracking-[-0.05em] text-ink">H</span>
            )}
          </Link>
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

        <div className="flex items-center justify-end">
          <Clock />
        </div>
      </div>
    </header>
  );
}