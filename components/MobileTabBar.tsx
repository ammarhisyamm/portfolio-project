"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, UserRound, BriefcaseBusiness, Mail, NotebookPen } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", Icon: House },
  { href: "/about-us", label: "About", Icon: UserRound },
  { href: "/blog", label: "Blog", Icon: NotebookPen },
  { href: "/contact", label: "Contact", Icon: Mail },
];

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Mobile navigation" className="floating-bottom-nav md:hidden">
      {TABS.map(({ href, label: tabLabel, Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            data-active={active || undefined}
            aria-current={active ? "page" : undefined}
            aria-label={tabLabel}
            className="bottom-nav-item"
          >
            <Icon size={22} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
          </Link>
        );
      })}
    </nav>
  );
}
