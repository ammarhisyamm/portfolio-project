import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const content = await getContent();
  const { contact, socials } = content;
  const linkedin = socials.items.find((s) => s.type === "linkedin")?.href ?? "#";

  return (
    <div className="grid gap-3 pb-16 pt-3 md:gap-4">
      <Reveal className="panel grid gap-6 p-5 sm:p-8 lg:p-10">
        <span className="kicker">Contact</span>
        <h1 className="max-w-[820px] text-[clamp(32px,4.4vw,58px)] font-normal leading-[1.03] tracking-[-0.06em]">
          Have a product, problem, or idea in mind?
        </h1>
        <p className="max-w-[560px] leading-relaxed text-sub">
          I&rsquo;m open to selected collaborations, product design projects, and conversations
          about creating better digital experiences.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
        <Reveal className="panel p-5 sm:p-8 md:col-span-8">
          <span className="kicker">Send a message</span>
          <div className="mt-6">
            <ContactForm email={contact.email} />
          </div>
        </Reveal>

        <Reveal className="panel flex flex-col gap-2 p-5 sm:p-8 md:col-span-4" y={18}>
          <span className="kicker">Elsewhere</span>
          <span className="mt-3 inline-flex w-max items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs font-medium text-sub">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {contact.available ? "Available for selected projects" : "Currently booked"}
          </span>
          <a href={`mailto:${contact.email}`} className="py-1.5 text-[13px] text-sub underline underline-offset-3 hover:text-ink">
            {contact.email}
          </a>
          <a href={linkedin} className="py-1.5 text-[13px] text-sub underline underline-offset-3 hover:text-ink">
            LinkedIn
          </a>
          <a href={contact.whatsapp} className="py-1.5 text-[13px] text-sub underline underline-offset-3 hover:text-ink">
            WhatsApp
          </a>
          <p className="mt-5 border-t border-line pt-5 text-[13px] leading-relaxed text-sub">
            {contact.note}
          </p>
        </Reveal>
      </div>
    </div>
  );
}