import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import WorkCanvas from "@/components/WorkCanvas";
import { projects } from "@/lib/projects";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <div className="grid gap-5 pb-16 pt-4 md:gap-[22px]">
      <Reveal className="panel grid gap-6 p-6 sm:p-10 lg:p-14">
        <span className="kicker">Work</span>
        <h1 className="max-w-[900px] text-[clamp(32px,4.4vw,58px)] font-normal leading-[1.03] tracking-[-0.06em]">
          A selection of products made clearer, more useful, and easier to move through.
        </h1>
      </Reveal>

      <WorkCanvas projects={projects} />
    </div>
  );
}