import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="grid gap-5 pb-16 pt-4 md:gap-[22px]">
      <Reveal className="panel grid gap-6 p-6 sm:p-10 lg:p-14">
        <span className="kicker">Contact</span>
        <h1 className="max-w-[820px] text-[clamp(32px,4.4vw,58px)] font-normal leading-[1.03] tracking-[-0.06em]">
          Have a product, problem, or idea in mind?
        </h1>
        <p className="max-w-[560px] leading-relaxed text-sub">
          I&rsquo;m open to selected collaborations, product design projects, and conversations
          about creating better digital experiences.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-[22px]">
        <Reveal className="panel p-6 sm:p-10 md:col-span-8">
          <span className="kicker">Send a message</span>
          <div className="mt-6">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal className="panel flex flex-col gap-2 p-6 sm:p-10 md:col-span-4" y={18}>
          <span className="kicker">Elsewhere</span>
          <span className="mt-3 inline-flex w-max items-center gap-2 rounded-full border border-[#cfeadb] bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            Available for selected projects
          </span>
          <a href="mailto:hello@hisyam.design" className="py-1.5 text-[13px] text-sub underline underline-offset-3 hover:text-ink">
            hello@hisyam.design
          </a>
          <a href="#" className="py-1.5 text-[13px] text-sub underline underline-offset-3 hover:text-ink">
            LinkedIn
          </a>
          <a href="#" className="py-1.5 text-[13px] text-sub underline underline-offset-3 hover:text-ink">
            WhatsApp
          </a>
          <p className="mt-5 border-t border-line pt-5 text-[13px] leading-relaxed text-sub">
            Based in Jakarta, Indonesia. Working with teams around the world.
          </p>
        </Reveal>
      </div>
    </div>
  );
}