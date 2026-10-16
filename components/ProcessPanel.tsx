import Reveal from "./Reveal";
import ProcessAccordion from "./ProcessAccordion";
import type { ProcessContent } from "@/lib/content";

export default function ProcessPanel({ process, capabilities }: { process: ProcessContent; capabilities: string[] }) {
  return (
    <Reveal className="panel p-5 sm:p-8" id="process">
      <span className="kicker">Process</span>
      <p className="mt-4 max-w-[560px] leading-relaxed text-sub">{process.intro}</p>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <section aria-labelledby="process-capabilities">
          <h2 id="process-capabilities" className="text-[11px] uppercase text-muted">Capabilities</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {capabilities.map((item) => <li key={item} className="process-chip">{item}</li>)}
          </ul>
        </section>
        <section aria-labelledby="process-skills">
          <h2 id="process-skills" className="text-[11px] uppercase text-muted">Skills &amp; tools</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {process.skills.map((item) => <li key={item} className="process-chip">{item}</li>)}
          </ul>
          <ul className="mt-3 flex flex-wrap gap-2">
            {process.tools.map((item) => <li key={item} className="process-chip process-chip-tool">{item}</li>)}
          </ul>
        </section>
      </div>
      <section aria-labelledby="process-steps" className="mt-8">
        <h2 id="process-steps" className="mb-2 text-[11px] uppercase text-muted">Design process</h2>
        <ProcessAccordion steps={process.steps} />
      </section>
    </Reveal>
  );
}
