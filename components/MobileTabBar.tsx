"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, BriefcaseBusiness, Mail } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", Icon: House },
  { href: "/playground", label: "Playground", Icon: BriefcaseBusiness },
  { href: "/contact", label: "Contact", Icon: Mail },
];

export default function MobileTabBar({ workLabel }: { workLabel?: string }) {
  const pathname = usePathname();
  const label = workLabel || "Playground";

  return (
    <nav aria-label="Mobile navigation" className="floating-bottom-nav md:hidden">
      {TABS.map(({ href, label: tabLabel, Icon }) => {
        const active =
          href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href);
        const displayLabel = href === "/playground" ? label : tabLabel;
        return (
          <Link
            key={href}
            href={href}
            data-active={active || undefined}
            aria-current={active ? "page" : undefined}
            aria-label={displayLabel}
            className="bottom-nav-item"
          >
            <Icon size={22} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
          </Link>
        );
      })}
    </nav>
  );
}