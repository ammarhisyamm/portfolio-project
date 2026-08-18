import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageTransition from "@/components/PageTransition";
import MobileTabBar from "@/components/MobileTabBar";

export const metadata: Metadata = {
  title: {
    default: "Hisyam — Senior UX/UI & Product Designer",
    template: "%s — Hisyam",
  },
  description:
    "Hisyam is a Jakarta-based senior UX/UI and product designer creating thoughtful digital products across fintech, SaaS, marketplaces, and AI-powered experiences.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="mx-auto max-w-shell px-5 pb-24 md:px-8 md:pb-0">
            <SiteHeader />
            <PageTransition>{children}</PageTransition>
            <SiteFooter />
          </div>
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  );
}