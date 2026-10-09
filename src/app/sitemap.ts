import type { MetadataRoute } from "next";
import { projectsData } from "@/app/data/projectsData";
import { SITE_URL } from "@/app/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const projectPages: MetadataRoute.Sitemap = projectsData.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projectPages,
  ];
}
