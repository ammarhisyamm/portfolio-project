import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageTransition from "@/components/PageTransition";
import MobileTabBar from "@/components/MobileTabBar";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

const FALLBACK_ICON = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="1" y="1" width="30" height="30" rx="9" fill="#f5f5f5" stroke="#161616" stroke-width="2"/><text x="16" y="21.5" font-family="ui-sans-serif, system-ui, sans-serif" font-size="15" font-weight="600" fill="#161616" text-anchor="middle">H</text></svg>`
)}`;

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
      <head>
        <link rel="icon" href={content.branding.logo || FALLBACK_ICON} />
      </head>
      <body>
        <Providers>
          <div className="mx-auto w-full max-w-[720px] px-4 sm:px-6">
            <SiteHeader logo={content.branding.logo} workLabel={content.menu.workLabel} />
            <PageTransition>{children}</PageTransition>
          </div>
          <div className="mx-auto w-full max-w-[720px] px-4 pb-28 sm:px-6 md:pb-0">
            <SiteFooter footer={content.footer} />
          </div>
          <MobileTabBar workLabel={content.menu.workLabel} />
        </Providers>
      </body>
    </html>
  );
}