import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import WorkCanvas from "@/components/WorkCanvas";
import { projects } from "@/lib/projects";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <div className="grid gap-3 pb-16 pt-3 md:gap-4">
      <Reveal className="panel grid gap-6 p-5 sm:p-8 lg:p-10">
        <span className="kicker">Work</span>
        <h1 className="max-w-[900px] text-[clamp(32px,4.4vw,58px)] font-normal leading-[1.03] tracking-[-0.06em]">
          A selection of products made clearer, more useful, and easier to move through.
        </h1>
      </Reveal>

      <WorkCanvas projects={projects} />
    </div>
  );
}