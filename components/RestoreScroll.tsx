"use client";

import { useLayoutEffect } from "react";

export default function RestoreScroll() {
  useLayoutEffect(() => {
    try {
      const saved = sessionStorage.getItem("hisyam.homeScroll");
      if (saved) {
        sessionStorage.removeItem("hisyam.homeScroll");
        window.scrollTo(0, Number(saved));
        requestAnimationFrame(() => window.scrollTo(0, Number(saved)));
      }
    } catch {
      /* ignore */
    }
  }, []);
  return null;
}
