import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import WorkCanvas from "@/components/WorkCanvas";
import { getContent } from "@/lib/content";

export const metadata: Metadata = { title: "Work" };

export default async function WorkPage() {
  const content = await getContent();
  const canvasItems = content.exploration
    .filter((x) => x.image)
    .map((x, i) => ({
      slug: `exploration-${i}`,
      title: x.label,
      category: "Exploration",
      year: "",
      image: x.image,
    }));
  return (
    <div className="grid gap-3 pb-16 pt-3 md:gap-4">
      <Reveal className="panel grid gap-6 p-5 sm:p-8 lg:p-10">
        <span className="kicker">Work</span>
        <h1 className="max-w-[900px] text-[clamp(26px,4vw,32px)] font-normal leading-[1.08] tracking-[-0.05em]">
          A selection of design explorations and interface studies.
        </h1>
      </Reveal>

      <WorkCanvas items={canvasItems} />
    </div>
  );
}