import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageTransition from "@/components/PageTransition";
import MobileTabBar from "@/components/MobileTabBar";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Hisyam — Senior UX/UI & Product Designer",
    template: "%s — Hisyam",
  },
  description:
    "Hisyam is a Jakarta-based senior UX/UI and product designer creating thoughtful digital products across fintech, SaaS, marketplaces, and AI-powered experiences.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="mx-auto w-full max-w-[720px] px-4 pb-28 sm:px-6 md:pb-0">
            <SiteHeader />
            <PageTransition>{children}</PageTransition>
            <SiteFooter footer={content.footer} />
          </div>
          <MobileTabBar />
        </Providers>
      </body>
    </html>
  );
}