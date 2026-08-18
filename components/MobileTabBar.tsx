"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, BriefcaseBusiness, Mail } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", Icon: House },
  { href: "/work", label: "Work", Icon: BriefcaseBusiness },
  { href: "/contact", label: "Contact", Icon: Mail },
];

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Mobile navigation" className="floating-bottom-nav md:hidden">
      {TABS.map(({ href, label, Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            data-active={active || undefined}
            aria-current={active ? "page" : undefined}
            aria-label={label}
            className="bottom-nav-item"
          >
            <Icon size={22} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
          </Link>
        );
      })}
    </nav>
  );
}