import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageRevealWrapper } from "@/components/page-reveal-wrapper";
import { ToastProvider } from "@/components/toast";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://connect.ras.ieeekerala.org"),
  title: {
    default: "RAS Connect IEEE | IEEE RAS Kerala Chapter - Robotics & Automation",
    template: "%s | RAS Connect IEEE",
  },
  description:
    "RAS Connect IEEE is the official digital platform of IEEE RAS Kerala Chapter (Robotics & Automation Society). Explore 37+ Student Branch Chapters, robotics events, technical workshops, competitions, and activities across Kerala.",
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
  authors: [{ name: "IEEE RAS Kerala Chapter", url: "https://connect.ras.ieeekerala.org" }],
  creator: "IEEE RAS Kerala Chapter",
  publisher: "IEEE Kerala Section",
  applicationName: "RAS Connect IEEE",
  alternates: {
    canonical: "https://connect.ras.ieeekerala.org",
  },
  icons: {
    icon: "/images/brand/ieee-ras-logo.png",
    apple: "/images/brand/ieee-ras-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://connect.ras.ieeekerala.org",
    title: "RAS Connect IEEE | Official IEEE RAS Kerala Chapter Platform",
    description:
      "Statewide showcase of robotics and automation events, workshops, hackathons, and 37+ student branch chapters led by IEEE RAS Kerala Chapter.",
    siteName: "RAS Connect IEEE",
    images: [
      {
        url: "/images/brand/ieee-ras-logo.png",
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
      "Statewide showcase of robotics and automation events, workshops, hackathons, and 37+ student branch chapters led by IEEE RAS Kerala Chapter.",
    images: ["/images/brand/ieee-ras-logo.png"],
    creator: "@IEEERASKerala",
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
      "@id": "https://connect.ras.ieeekerala.org/#website",
      "url": "https://connect.ras.ieeekerala.org",
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
        "target": "https://connect.ras.ieeekerala.org/events/?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://connect.ras.ieeekerala.org/#organization",
      "name": "IEEE RAS Kerala Chapter",
      "alternateName": [
        "IEEE Robotics and Automation Society Kerala Chapter",
        "IEEE RAS Kerala Section",
        "RAS Connect IEEE",
      ],
      "url": "https://connect.ras.ieeekerala.org",
      "logo": "https://connect.ras.ieeekerala.org/images/brand/ieee-ras-logo.png",
      "sameAs": ["https://ras.ieeekerala.org", "https://ieeekerala.org"],
      "parentOrganization": {
        "@type": "Organization",
        "name": "IEEE Kerala Section",
        "url": "https://ieeekerala.org",
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ToastProvider>
          <PageRevealWrapper>
            <SiteHeader />
            <main id="main-content">{children}</main>
            <SiteFooter />
          </PageRevealWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
