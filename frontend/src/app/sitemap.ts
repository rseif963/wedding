import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.wedpine.com",
      lastModified: new Date(),
    },
    {
      url: "https://www.wedpine.com/vendors",
      lastModified: new Date(),
    },
    {
      url: "https://www.wedpine.com/auth",
      lastModified: new Date(),
    },
  ];
}
