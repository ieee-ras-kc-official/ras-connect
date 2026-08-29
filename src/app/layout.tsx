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
  title: {
    default: "RAS Connect | IEEE RAS Kerala Chapter",
    template: "%s | RAS Connect",
  },
  description:
    "A showcase of robotics and automation events led by IEEE RAS student chapters across Kerala.",
  icons: {
    icon: "/images/brand/ieee-ras-logo.png",
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
