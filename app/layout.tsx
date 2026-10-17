import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "./museum.css";
import Providers from "@/components/Providers";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PageTransition from "@/components/PageTransition";
import MobileTabBar from "@/components/MobileTabBar";
import DesignLabLauncher from "@/components/DesignLabLauncher";
import { getContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

// Pages are cached and rebuilt in the background; CMS saves also revalidate on demand.
export const revalidate = 60;

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

const FALLBACK_ICON = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="1" y="1" width="30" height="30" rx="9" fill="#f5f5f5" stroke="#161616" stroke-width="2"/><text x="16" y="21.5" font-family="ui-sans-serif, system-ui, sans-serif" font-size="15" font-weight="600" fill="#161616" text-anchor="middle">H</text></svg>`
)}`;

const DESCRIPTION =
  "Hisyam is a Jakarta-based senior UX/UI and product designer creating thoughtful digital products across fintech, SaaS, marketplaces, and AI-powered experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hisyam — Senior UX/UI & Product Designer",
    template: "%s — Hisyam",
  },
  description: DESCRIPTION,
  applicationName: "Hisyam Design",
  authors: [{ name: "Hisyam" }],
  keywords: ["Hisyam", "product designer", "UX designer", "UI designer", "UX/UI", "Jakarta", "design systems", "portfolio"],
  openGraph: {
    type: "website",
    siteName: "Hisyam Design",
    title: "Hisyam — Senior UX/UI & Product Designer",
    description: DESCRIPTION,
    url: "/",
    locale: "en_US",
    images: [{ url: "/case-studies/nomory-cover.webp", width: 1672, height: 941, alt: "Hisyam's portfolio" }],
  },
  twitter: { card: "summary_large_image", title: "Hisyam — Senior UX/UI & Product Designer", description: DESCRIPTION, images: ["/case-studies/nomory-cover.webp"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Cover the first visit before hydration; repeat visits never wait for the intro. */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(location.pathname==='/'&&(new URLSearchParams(location.search).get('entrance')==='1'||sessionStorage.getItem('hisyam.home-entrance.seen.v3')!=='1'))document.documentElement.setAttribute('data-studio-pending','true')}catch(e){if(location.pathname==='/')document.documentElement.setAttribute('data-studio-pending','true')}` }} />
        <link rel="icon" href={content.branding.logo || FALLBACK_ICON} />
      </head>
      <body className={`${manrope.variable} font-sans`}>
        <Providers>
          <div data-portfolio-shell>
          <div className="mx-auto w-full max-w-[720px] px-4 sm:px-6">
            <SiteHeader logo={content.branding.logo} workLabel={content.menu.workLabel} />
            <PageTransition>{children}</PageTransition>
          </div>
          <div className="mx-auto w-full max-w-[720px] px-4 pb-28 sm:px-6 md:pb-0">
            <SiteFooter footer={content.footer} />
          </div>
          <MobileTabBar />
          <DesignLabLauncher />
          </div>
        </Providers>
      </body>
    </html>
  );
}
