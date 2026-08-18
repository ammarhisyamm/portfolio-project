import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const content = await getContent();
  const { contact, socials } = content;
  const linkedin = socials.items.find((s) => s.type === "linkedin")?.href ?? "#";
  const external = (href: string) => href.startsWith("http");

  const rows: { label: string; value: string; href?: string; external?: boolean }[] = [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { label: "Location", value: contact.location },
    ...(contact.whatsapp && contact.whatsapp !== "#"
      ? [{ label: "WhatsApp", value: "Chat on WhatsApp", href: contact.whatsapp, external: external(contact.whatsapp) }]
      : []),
    ...(linkedin !== "#"
      ? [{ label: "LinkedIn", value: "View profile", href: linkedin, external: external(linkedin) }]
      : []),
    ...socials.items
      .filter((s) => !["linkedin"].includes(s.type) && s.href !== "#")
      .map((s) => ({ label: s.label, value: "Open profile", href: s.href, external: external(s.href) })),
  ];

  return (
    <div className="mx-auto w-full max-w-[650px] px-4 sm:px-0">
      <section className="pt-16 sm:pt-24">
        <p className="kicker">Contact</p>
        <h1 className="mt-6 text-[26px] font-medium tracking-[-0.02em] text-ink sm:text-[30px]">
          Let&rsquo;s build something considered.
        </h1>
        <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.75] text-sub">
          I&rsquo;m open to selected collaborations, product design projects, and conversations
          about creating better digital experiences.
        </p>
        <p className="mt-6 flex items-center gap-2 text-[13px] text-sub">
          <span
            className={`h-1.5 w-1.5 rounded-full ${contact.available ? "bg-accent" : "bg-muted"}`}
            aria-hidden="true"
          />
          {contact.available ? "Available for selected projects" : "Currently booked"}
        </p>

        <div className="mt-10 grid grid-cols-1">
          {rows.map((row) => (
            <a
              key={row.label}
              href={row.href}
              target={row.external ? "_blank" : undefined}
              rel={row.external ? "noreferrer" : undefined}
              className={`group flex items-center justify-between border-t border-line py-4 text-[14px] text-ink no-underline transition-colors hover:text-sub ${
                row.href ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted">{row.label}</span>
              <span className="inline-flex items-center gap-1.5">
                {row.value}
                {row.href && (
                  <ArrowUpRight
                    size={14}
                    className="text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                )}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-line pt-16 pb-20 sm:pt-24 sm:pb-28">
        <p className="kicker">Send a message</p>
        <div className="mt-8">
          <ContactForm email={contact.email} />
        </div>
      </section>
    </div>
  );
}
