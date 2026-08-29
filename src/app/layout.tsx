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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rasconnect.ieee-ras-kerala.org"),
  title: {
    default: "RAS Connect | IEEE RAS Kerala Chapter - Robotics & Automation",
    template: "%s | RAS Connect",
  },
  description:
    "Discover RAS Connect, the ultimate digital showcase of robotics events, workshops, hackathons, and activities organized by IEEE Robotics & Automation Society (RAS) Student Branch Chapters across Kerala.",
  keywords: [
    "RAS Connect",
    "RASConnect",
    "IEEE RAS Kerala Chapter",
    "IEEE RAS Kerala Section",
    "Robotics Kerala",
    "Automation Kerala",
    "IEEE Student Branch Kerala",
    "Robotics Events",
    "Technical Workshops Kerala",
    "Hackathons Kerala",
    "RAS Day Initiative",
  ],
  authors: [{ name: "IEEE RAS Kerala Section", url: "https://ieee-ras-kerala.org" }],
  creator: "IEEE RAS Kerala Chapter",
  icons: {
    icon: "/images/brand/ieee-ras-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rasconnect.ieee-ras-kerala.org",
    title: "RAS Connect | IEEE RAS Kerala Chapter",
    description:
      "A statewide digital showcase of robotics and automation events led by IEEE RAS student chapters across Kerala.",
    siteName: "RAS Connect",
    images: [
      {
        url: "/images/brand/ieee-ras-logo.png",
        width: 1200,
        height: 630,
        alt: "IEEE RAS Kerala Chapter Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RAS Connect | IEEE RAS Kerala Chapter",
    description:
      "A statewide digital showcase of robotics and automation events led by IEEE RAS student chapters across Kerala.",
    images: ["/images/brand/ieee-ras-logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
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
