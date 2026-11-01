import type { Metadata } from "next";
import Hero from "@/components/Hero";
import AboutPanel from "@/components/AboutPanel";
import ExperienceAccordion from "@/components/ExperienceAccordion";
import CategoryStacks from "@/components/CategoryStacks";
import RestoreScroll from "@/components/RestoreScroll";
import SelectedWork from "@/components/SelectedWork";
import HomeEntrance from "@/components/HomeEntrance";
import MuseumExperience from "@/components/MuseumExperience";
import BlogPanel from "@/components/BlogPanel";
import { getBlogSummaries } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { getContent } from "@/lib/content";
import { withShowcase } from "@/lib/showcase-categories";

export const metadata: Metadata = {
  title: "Ammar Hisyam Fakhrudin | Product Designer",
  description: "Jakarta-based product designer who turns everyday problems into simple, useful products. Explore selected work, experience, and CV.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [content, posts] = await Promise.all([getContent(), getBlogSummaries()]);
  const featured = content.caseStudies
    .filter((c) => c.featured && c.published)
    .sort((a, b) => a.featured_order - b.featured_order);
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ammar Hisyam Fakhrudin",
    jobTitle: content.hero.title,
    description: content.hero.intro,
    url: SITE_URL,
    email: content.contact.email ? `mailto:${content.contact.email}` : undefined,
    address: content.contact.location ? { "@type": "PostalAddress", addressLocality: content.contact.location } : undefined,
    sameAs: content.socials.items.map((item) => item.href).filter((href) => /^https?:\/\//.test(href)),
    knowsAbout: content.about.capabilities,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} />
      <HomeEntrance />
      <div className="page-stack grid pb-16 pt-3">
        <RestoreScroll />
        <Hero
          name={content.hero.name}
          title={content.hero.title}
          headline={content.hero.headline}
          intro={content.hero.intro}
          available={content.hero.available}
          socials={content.socials.items}
          trust={content.trust}
          profilePhoto={content.branding.profilePhoto}
          cvUrl={content.about.cvUrl}
        />

        <section id="selected-work" className="panel scroll-mt-28 p-5 sm:p-8" aria-labelledby="selected-work-title">
          <h2 id="selected-work-title" className="kicker">Selected work</h2>
          <p className="mt-3 max-w-[560px] text-[14px] leading-relaxed text-sub">A few projects, from the first question to a shipped product, with the decisions in between.</p>
          <div className="mt-8">
            <SelectedWork caseStudies={featured} />
          </div>
        </section>

        <ExperienceAccordion items={content.experience} />

        <AboutPanel about={content.about} contact={content.contact} socials={content.socials.items} />

        <CategoryStacks categories={withShowcase(content.homeCategories)} />

        <BlogPanel posts={posts} />

        {/* The 3D museum: opens full screen; in the classic view its entry sits at the end of the page. */}
        <MuseumExperience content={content} posts={posts} />
      </div>
    </>
  );
}
