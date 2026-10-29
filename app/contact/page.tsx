import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Ammar Hisyam | Product Design Roles & Projects",
  description: "Contact Hisyam about a full-time product design role or a project. Share your team's needs through the form or email him directly.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const content = await getContent();
  const { contact } = content;

  return (
    <div className="grid gap-3 pb-16 pt-3 md:gap-4">
      <Reveal className="panel grid gap-6 p-5 sm:p-8 lg:p-10">
        <span className="kicker">Contact</span>
        <h1 className="max-w-[820px] text-[clamp(26px,4vw,32px)] font-normal leading-[1.08] tracking-[-0.05em]">
          Let&apos;s talk about a role or a product.
        </h1>
        <p className="max-w-[560px] leading-relaxed text-sub">
          I&rsquo;m open to full-time product design roles and selected projects. Share what your team needs and a little context about the work.
        </p>
      </Reveal>

      <Reveal className="panel p-5 sm:p-8">
        <span className="kicker">Send a message</span>
        <p className="mt-2 text-sm text-sub">All fields are required.</p>
        <div className="mt-6">
          <ContactForm email={contact.email} />
        </div>
      </Reveal>
    </div>
  );
}
