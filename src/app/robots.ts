import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // The API and the emailed confirm links have nothing to index.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/waitlist/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
