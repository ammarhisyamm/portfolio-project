"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { reducedMotion } from "@/lib/utils";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("hisyam.returnHome")) {
        sessionStorage.removeItem("hisyam.returnHome");
        return;
      }
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}