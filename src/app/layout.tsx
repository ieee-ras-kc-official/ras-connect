import { headers } from "next/headers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToastProvider } from "@/components/toast";
import { SITE_URL } from "@/config/api";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RAS Connect IEEE | IEEE RAS Kerala Chapter - Robotics & Automation",
    template: "%s | RAS Connect IEEE",
  },
  description:
    "RAS Connect IEEE is the official digital platform of IEEE RAS Kerala Chapter (Robotics & Automation Society). Explore Student Branch Chapters, robotics events, technical workshops, competitions, and activities across Kerala.",
  keywords: [
    "ras connect",
    "ras connect ieee",
    "ieee ras connect",
    "ras connect kerala",
    "ieee ras connect kerala",
    "ieee ras kerala chapter",
    "ieee ras kerala section",
    "ieee robotics and automation society kerala",
    "robotics kerala",
    "automation kerala",
    "ieee student branch chapters kerala",
    "robotics events kerala",
    "technical workshops kerala",
    "hackathons kerala",
    "ras day initiative",
    "ieee kerala section",
    "connect ras ieee kerala",
  ],
  authors: [{ name: "IEEE RAS Kerala Chapter", url: SITE_URL }],
  creator: "IEEE RAS Kerala Chapter",
  publisher: "IEEE Kerala Section",
  applicationName: "RAS Connect IEEE",
  icons: {
    icon: "/images/brand/ieee-ras-logo.png",
    apple: "/images/brand/ieee-ras-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "RAS Connect IEEE | Official IEEE RAS Kerala Chapter Platform",
    description:
      "Statewide showcase of robotics and automation events, workshops, hackathons, and student branch chapters led by IEEE RAS Kerala Chapter.",
    siteName: "RAS Connect IEEE",
    images: [
      {
        url: "/images/brand/social-card.png",
        width: 1200,
        height: 630,
        alt: "RAS Connect IEEE - IEEE RAS Kerala Chapter Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RAS Connect IEEE | IEEE RAS Kerala Chapter",
    description:
      "Statewide showcase of robotics and automation events, workshops, hackathons, and student branch chapters led by IEEE RAS Kerala Chapter.",
    images: ["/images/brand/social-card.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "RAS Connect IEEE",
      "alternateName": [
        "RAS Connect",
        "IEEE RAS Connect",
        "RAS Connect IEEE Kerala",
        "IEEE RAS Kerala Section Connect",
      ],
      "description":
        "The official digital platform of IEEE Robotics & Automation Society (RAS) Kerala Chapter.",
      "inLanguage": "en-US",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_URL}/events/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      "name": "IEEE RAS Kerala Chapter",
      "alternateName": [
        "IEEE Robotics and Automation Society Kerala Chapter",
        "IEEE RAS Kerala Section",
        "RAS Connect IEEE",
      ],
      "url": SITE_URL,
      "logo": `${SITE_URL}/images/brand/ieee-ras-logo.png`,
      "sameAs": ["https://ras.ieeekerala.org", "https://ieeekerala.org"],
      "parentOrganization": {
        "@type": "Organization",
        "name": "IEEE Kerala Section",
        "url": "https://ieeekerala.org",
      },
    },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") || undefined;
  return (
    <html lang="en">
      <head>
        <script
          nonce={nonce}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <ToastProvider>

          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />

        </ToastProvider>
      </body>
    </html>
  );
}
