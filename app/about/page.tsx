import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const content = await getContent();
  const { about, contact, socials } = content;
  const linkedin = socials.items.find((s) => s.type === "linkedin")?.href ?? "#";
  const external = (href: string) => href.startsWith("http");

  return (
    <div className="mx-auto w-full max-w-[650px] px-4 sm:px-0">
      {/* ABOUT */}
      <section className="pt-16 sm:pt-24">
        <p className="kicker">About</p>
        <p className="mt-6 text-[22px] font-medium leading-[1.35] tracking-[-0.02em] text-ink">
          {about.introTitle}
        </p>
        <p className="mt-5 max-w-[60ch] text-[15px] leading-[1.75] text-sub">
          {about.introBody}
        </p>
        {about.background.map((para) => (
          <p key={para} className="mt-5 max-w-[60ch] text-[15px] leading-[1.75] text-sub">
            {para}
          </p>
        ))}

        {about.capabilities.length > 0 && (
          <div className="mt-10">
            <p className="kicker">What I do</p>
            <ul className="mt-3 grid list-none grid-cols-1 gap-x-8 sm:grid-cols-2" style={{ padding: 0 }}>
              {about.capabilities.map((c) => (
                <li key={c} className="border-t border-line py-3.5 text-[14px] text-sub">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {about.tools && (
          <p className="mt-8 max-w-[60ch] text-[13.5px] leading-[1.7] text-muted">{about.tools}</p>
        )}
      </section>

      {/* EXPERIENCE */}
      <section className="border-t border-line pt-16 sm:pt-24">
        <p className="kicker">Experience</p>
        <div className="relative mt-10 ml-3 border-l border-line">
          {content.experience.map((job) => (
            <div key={job.company} className="relative pb-12 pl-8 last:pb-0">
              <span
                className="absolute -left-[7px] top-1.5 h-[13px] w-[13px] rounded-full border border-line-strong bg-bg"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[16px] font-medium tracking-[-0.01em] text-ink">{job.role}</h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                  {job.period}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-sub">{job.company}</p>
              {job.points.length > 0 && (
                <ul className="mt-3 grid list-none gap-1.5" style={{ padding: 0 }}>
                  {job.points.map((point) => (
                    <li key={point} className="text-[14px] leading-[1.7] text-sub">
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATION */}
      <section className="border-t border-line pt-16 sm:pt-24">
        <p className="kicker">Education</p>
        <div className="relative mt-10 ml-3 border-l border-line">
          {about.education.map((ed) => (
            <div key={`${ed.school}-${ed.degree}`} className="relative pb-10 pl-8 last:pb-0">
              <span
                className="absolute -left-[7px] top-1.5 h-[13px] w-[13px] rounded-full border border-line-strong bg-bg"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[16px] font-medium tracking-[-0.01em] text-ink">{ed.degree}</h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
                  {ed.period}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-sub">{ed.school}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CERTIFICATIONS */}
      {about.certifications.length > 0 && (
        <section className="border-t border-line pt-16 sm:pt-24">
          <p className="kicker">Certifications</p>
          <ul className="mt-6 list-none" style={{ padding: 0 }}>
            {about.certifications.map((cert) => (
              <li key={cert} className="border-t border-line py-4 text-[14px] text-sub first:border-t-0">
                {cert}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CONTACT */}
      <section className="border-t border-line pt-16 pb-20 sm:pt-24 sm:pb-28">
        <p className="kicker">Contact</p>
        <div className="mt-8 grid grid-cols-1 gap-0">
          <a
            href={`mailto:${contact.email}`}
            className="group flex items-center justify-between border-t border-line py-4 text-[14px] text-ink no-underline transition-colors hover:text-sub"
          >
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted">Email</span>
            <span className="inline-flex items-center gap-1.5">
              {contact.email}
              <ArrowUpRight
                size={14}
                className="text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </a>
          <a
            href={linkedin}
            target={external(linkedin) ? "_blank" : undefined}
            rel={external(linkedin) ? "noreferrer" : undefined}
            className="group flex items-center justify-between border-t border-line py-4 text-[14px] text-ink no-underline transition-colors hover:text-sub"
          >
            <span className="text-[11px] uppercase tracking-[0.14em] text-muted">LinkedIn</span>
            <span className="inline-flex items-center gap-1.5">
              View profile
              <ArrowUpRight
                size={14}
                className="text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </a>
        </div>
        <p className="mt-10 text-[13px] text-muted">{contact.note}</p>
      </section>
    </div>
  );
}
