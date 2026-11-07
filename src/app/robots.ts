import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/api";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/login/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
