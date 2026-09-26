"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.main
      key={pathname}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={prefersReducedMotion ? { duration: 0.18, ease: "easeOut" } : { duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[70vh]"
    >
      {children}
    </motion.main>
  );
}
