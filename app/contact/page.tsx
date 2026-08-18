import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const content = await getContent();
  const { contact } = content;

  return (
    <div className="grid gap-3 pb-16 pt-3 md:gap-4">
      <Reveal className="panel grid gap-6 p-5 sm:p-8 lg:p-10">
        <span className="kicker">Contact</span>
        <h1 className="max-w-[820px] text-[clamp(30px,4vw,48px)] font-normal leading-[1.03] tracking-[-0.06em]">
          Have a product, problem, or idea in mind?
        </h1>
        <p className="max-w-[560px] leading-relaxed text-sub">
          I&rsquo;m open to selected collaborations, product design projects, and conversations
          about creating better digital experiences.
        </p>
      </Reveal>

      <Reveal className="panel p-5 sm:p-8">
        <span className="kicker">Send a message</span>
        <div className="mt-6">
          <ContactForm email={contact.email} />
        </div>
      </Reveal>
    </div>
  );
}