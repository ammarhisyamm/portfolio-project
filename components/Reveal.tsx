"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { reducedMotion } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  y?: number;
};

export default function Reveal({ children, className, y = 28 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y });
    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%" },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}