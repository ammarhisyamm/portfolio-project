import HomeIntro from "@/components/HomeIntro";
import CategoryStacks from "@/components/CategoryStacks";
import RestoreScroll from "@/components/RestoreScroll";
import { getContent } from "@/lib/content";

export default async function HomePage() {
  const content = await getContent();

  return (
    <div className="mx-auto w-full max-w-[650px] px-4 sm:px-0">
      <RestoreScroll />
      <HomeIntro
        name={content.hero.name}
        title={content.hero.title}
        headline={content.hero.headline}
        intro={content.hero.intro}
        available={content.hero.available}
        email={content.contact.email}
        location={content.contact.location}
        socials={content.socials.items}
      />

      <div className="mt-16 sm:mt-24">
        <CategoryStacks categories={content.homeCategories} />
      </div>

      <section className="mt-16 border-t border-line py-16 sm:mt-24 sm:py-20">
        <p className="kicker">Contact</p>
        <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.75] text-sub">
          Have a product, problem, or idea in mind? I&rsquo;m open to selected collaborations and
          conversations about better digital experiences.
        </p>
        <a
          href={`mailto:${content.contact.email}`}
          className="mt-6 inline-block border-b border-ink pb-0.5 text-[14px] text-ink no-underline transition-colors hover:text-sub hover:border-sub"
        >
          {content.contact.email}
        </a>
      </section>
    </div>
  );
}
