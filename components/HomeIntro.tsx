import { ArrowUpRight } from "lucide-react";
import type { SocialLink } from "@/lib/content";

export default function HomeIntro({
  name,
  title,
  headline,
  intro,
  available,
  email,
  location,
  socials,
}: {
  name: string;
  title: string;
  headline: string;
  intro: string;
  available: boolean;
  email: string;
  location: string;
  socials: SocialLink[];
}) {
  const external = (href: string) => href.startsWith("http");

  return (
    <section className="pt-16 sm:pt-24">
      <p className="kicker">Profile</p>
      <h1 className="mt-5 text-[30px] font-semibold tracking-[-0.03em] text-ink sm:text-[34px]">
        {name}
      </h1>
      <p className="mt-1.5 text-[15px] text-sub">{title}</p>

      <p className="mt-8 max-w-[60ch] text-[15px] leading-[1.75] text-sub">
        {headline || intro}
      </p>

      <p className="mt-8 flex items-center gap-2 text-[13px] text-sub">
        <span
          className={`h-1.5 w-1.5 rounded-full ${available ? "bg-accent" : "bg-muted"}`}
          aria-hidden="true"
        />
        {available ? "Available for selected projects" : "Currently booked"}
      </p>

      <div className="mt-10 border-t border-line pt-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a
            href={`mailto:${email}`}
            className="group inline-flex items-center gap-1.5 text-[13px] text-ink no-underline transition-colors hover:text-sub"
          >
            {email}
            <ArrowUpRight
              size={13}
              className="text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
          <span className="text-[13px] text-muted">{location}</span>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={external(s.href) ? "_blank" : undefined}
              rel={external(s.href) ? "noreferrer" : undefined}
              className="group inline-flex items-center gap-1.5 text-[13px] text-ink no-underline transition-colors hover:text-sub"
            >
              {s.label}
              <ArrowUpRight
                size={13}
                className="text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
