import { trustItems } from "@/lib/projects";
import Reveal from "./Reveal";

export default function TrustStrip() {
  return (
    <Reveal className="panel flex flex-wrap items-center justify-between gap-6 px-6 py-6 sm:px-8 lg:py-7">
      <div className="max-w-[320px]">
        <span className="kicker mb-2.5">Experience</span>
        <p className="m-0 text-sm leading-normal text-sub">
          Experience across product, UX/UI, and digital experiences.
        </p>
      </div>
      <ul className="m-0 flex flex-wrap gap-2.5 p-0" style={{ listStyle: "none" }}>
        {trustItems.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-line px-4 py-2 text-[13px] text-sub"
          >
            <span className="h-[5px] w-[5px] rounded-full bg-muted" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}