import type { SiteContent } from "@/lib/content";
import type { BlogSummary } from "@/lib/blog";
import { caseStudyCover } from "@/lib/case-study-visuals";
import type { MuseumData, MuseumExhibit } from "./types";
import { SHOWCASE } from "./showcase";

/** An exhibition view of existing CMS content, with no second content store. */
export function museumContent(content: SiteContent, posts: BlogSummary[] = []): MuseumData {
  const work = content.caseStudies.filter(study => study.published).sort((a, b) => Number(b.featured) - Number(a.featured) || a.featured_order - b.featured_order);
  const exhibits: MuseumExhibit[] = work.slice(0, 3).map(study => ({
    id: `work-${study.slug}`, room: "work", title: study.title,
    subtitle: [study.platform || study.category, study.industry].filter(Boolean).join(" / "),
    description: study.short_description || study.hero_description,
    image: study.thumbnail || study.hero_image || caseStudyCover(study.slug),
    action: "View case study", studySlug: study.slug,
  }));
  exhibits.push({ id: "work-collection", room: "work", title: "The collection", subtitle: "Product design", description: `Explore all ${work.length} published projects, from the first question to the final interface.`, image: "", action: "Browse all work" });
  // Gallery 2 east: how the work gets done.
  exhibits.push(
    { id: "process-capabilities", room: "process", title: "Capabilities", subtitle: "What I bring to a team", description: content.process.intro, image: "", chips: content.about.capabilities.filter(Boolean), action: "See how I work", href: "/about-us" },
    { id: "process-skills", room: "process", title: "Skills & tools", subtitle: "From research to handoff", description: "The skills I lean on in every project, and the tools I use to get the work done.", image: "", chips: content.process.skills, tools: content.process.tools, action: "See how I work", href: "/about-us" },
    { id: "process-steps", room: "process", title: "Design process", subtitle: content.process.steps.map(step => step.title).join(" / "), description: "The steps that take a product from the first question to a confident handoff.", image: "", steps: content.process.steps, action: "See how I work", href: "/about-us" },
  );
  // Gallery 1 east: the portfolio showcase (websites, dashboards, mobile apps).
  exhibits.push(...SHOWCASE);
  const photos = content.about.gallery.filter(item => item.image);
  const firstRole = content.experience[0];
  const cvHref = content.about.cvUrl ? `${content.about.cvUrl}${content.about.cvUrl.includes("?") ? "&" : "?"}download=${encodeURIComponent((content.about.cvLabel || "CV").replace(/\s+/g, "_") + ".pdf")}` : "";
  const cv = cvHref ? { href: cvHref, label: content.about.cvLabel || "Download CV", file: `${(content.about.cvLabel || "CV").replace(/\s+/g, "_")}.pdf` } : undefined;
  const socials = content.socials.items.filter(item => /^https?:\/\//.test(item.href));
  exhibits.push(
    { id: "about-journey", room: "about", title: "My journey", subtitle: content.hero.title, description: content.about.introBody, list: content.about.background.filter(Boolean), cv, socials, image: content.branding.profilePhoto || photos[0]?.image || "", action: "Meet Hisyam", href: "/about-us" },
    { id: "about-experience", room: "about", title: "Work experience", subtitle: firstRole ? `Now: ${firstRole.role} at ${firstRole.company}` : "Where I have worked", description: `${content.experience.length} roles across product teams, studios and client work.`, timeline: content.experience.map(item => ({ title: item.company, meta: [item.role, item.period].filter(Boolean).join(" · "), points: item.points.filter(Boolean), images: (item.images ?? []).filter(Boolean).slice(0, 3) })), image: content.experience.find(item => item.images[0])?.images[0] || "", action: "Read the full story", href: "/about-us" },
    { id: "about-album", room: "about", title: "Photo album", subtitle: `${photos.length} moments outside the screen`, description: "A few photos from the album, and the small stories behind them.", album: photos.map(item => ({ image: item.image, title: item.title, note: item.note, alt: item.alt })), image: photos[1]?.image || photos[0]?.image || "", action: "See the album", href: "/about-us" },
    { id: "contact-studio", room: "contact", title: "Let's talk", subtitle: content.contact.email, description: content.contact.note || "Have a project, a question, or an idea to share? I'd love to hear from you.", image: "", form: true, action: "Tap to write a message" },
  );
  // The Reading Room: the newest articles hang on the wall; the desk holds the rest.
  posts.slice(0, 3).forEach(post => exhibits.push({ id: `blog-${post.slug}`, room: "blog", title: post.title, subtitle: post.date ? new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Article", description: post.subtitle, image: post.cover, post: post.slug, action: "Read the article", href: `/blog/${post.slug}` }));
  exhibits.push({ id: "blog-index", room: "blog", title: "The reading desk", subtitle: posts.length ? `${posts.length} articles` : "Articles", description: posts.length ? "Every article in one place. Pick one and read it right here." : "New articles will appear here soon.", image: "", postIndex: true, action: "Browse all articles", href: "/blog" });
  exhibits.push(...museumSecrets(content));
  return { name: content.hero.name, available: content.hero.available, exhibits };
}

/** Hidden finds use the same CMS fields as the rest of the site. A find is
 * left out when its source field is empty, so nothing is invented. */
function museumSecrets(content: SiteContent): MuseumExhibit[] {
  const secret = (item: Omit<MuseumExhibit, "secret" | "image"> & { image?: string }): MuseumExhibit => ({ image: "", secret: true, ...item });
  const found: MuseumExhibit[] = [];
  const background = content.about.background.filter(Boolean);
  if (background.length) found.push(secret({ id: "secret-journal", room: "studio", title: "The journal on the side table", subtitle: "Before the portfolio", description: "A few pages about where the practice started.", list: background, action: "Read more about me", href: "/about-us" }));
  const industries = content.about.industries.filter(Boolean);
  if (industries.length) found.push(secret({ id: "secret-shelf", room: "studio", title: "A book that sticks out", subtitle: "Industries on the shelf", description: "Each spine on this shelf is an industry I have designed for.", industries, action: "See the work", href: "/about-us" }));
  const studies = content.exploration.filter(item => item.label);
  if (studies.length) found.push(secret({ id: "secret-sketchbook", room: "studio", title: "An open sketchbook", subtitle: `${studies.length} studies inside`, description: "Loose ideas that became interface studies in the Playground.", list: studies.slice(0, 6).map(item => item.label), images: studies.filter(item => item.image).slice(0, 4).map(item => item.image), action: "Open the Playground", href: "/playground" }));
  if (content.about.cvUrl) found.push(secret({ id: "secret-cv", room: "studio", title: "Papers on the desk", subtitle: content.about.cvLabel || "Curriculum vitae", description: "The whole story on one page, left on the desk for whoever wanders in.", action: content.about.cvLabel || "Open the CV", href: content.about.cvUrl, external: true }));
  const photos = content.about.gallery.filter(item => item.image && !item.placeholder);
  if (photos.length) found.push(secret({ id: "secret-pinboard", room: "studio", title: "The pinboard", subtitle: "Moments from the studio", description: photos.map(item => item.title).filter(Boolean).slice(0, 3).join(" / ") || "Photos pinned above the bookshelf.", images: photos.slice(0, 6).map(item => item.image), action: "See the full album", href: "/about-us" }));
  const trust = content.trust.map(item => item.label).filter(Boolean);
  if (trust.length) found.push(secret({ id: "secret-olive", room: "about", title: "A note tucked in the olive planter", subtitle: "Teams I have worked with", description: "Written small, as a thank-you.", list: trust, action: "Start a conversation", href: "/contact" }));
  if (content.hero.headline || content.hero.intro) found.push(secret({ id: "secret-plinth", room: "work", title: "A folded note under the bust", subtitle: content.hero.title, description: [content.hero.headline, content.hero.intro].filter(Boolean).join(" "), action: "Meet Hisyam", href: "/about-us" }));
  found.push(secret({ id: "secret-cat", room: "studio", title: "The studio cat", subtitle: "Quality inspector", description: "Every studio needs someone to sit on the keyboard at exactly the right moment. You have been approved for a closer look around.", action: "Back to the collection", href: "" }));
  return found;
}
