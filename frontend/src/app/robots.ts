import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/vdashboard", "/admin-dashboard"],
    },
    sitemap: "https://www.wedpine.com/sitemap.xml",
  };
}
