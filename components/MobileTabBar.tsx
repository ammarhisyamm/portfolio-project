"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, UserRound, BriefcaseBusiness, Mail } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", Icon: House },
  { href: "/about", label: "About", Icon: UserRound },
  { href: "/work", label: "Work", Icon: BriefcaseBusiness },
  { href: "/contact", label: "Contact", Icon: Mail },
];

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-4 z-40 px-5 md:hidden">
      <div className="mx-auto flex max-w-[420px] items-center justify-around gap-1 rounded-card border border-line bg-panel/90 px-2 py-2 shadow-soft backdrop-blur">
        {TABS.map(({ href, label, Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-[68px] flex-col items-center gap-1 rounded-card px-3 py-1.5 transition-colors duration-200 ${
                active ? "bg-ink text-white" : "text-sub"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              <span className="text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}