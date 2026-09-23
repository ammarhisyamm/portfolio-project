import type { Metadata } from "next";
import StylePlayground from "@/components/StylePlayground";

export const metadata: Metadata = {
  title: "Design Lab",
  description: "Experiment with button shape and section spacing in a live portfolio preview.",
};

export default function DesignLabPage() {
  return (
    <div className="page-stack grid pb-16 pt-3">
      <section className="panel p-5 sm:p-8">
        <span className="kicker">Design Lab</span>
        <h1 className="mt-4 text-[clamp(26px,4vw,34px)] font-normal leading-[1.15] tracking-[-0.05em]">
          Explore the little details.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-sub">Try different button corners and section spacing in the preview below.</p>
      </section>
      <StylePlayground />
    </div>
  );
}
