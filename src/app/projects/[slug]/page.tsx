import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectsData } from "@/app/data/projectsData";
import ProjectDetailClient from "./ProjectDetailClient";

export function generateStaticParams() {
  return projectsData.map((project) => ({ slug: project.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsData.find((item) => item.slug === slug);

  if (!project) {
    return { title: "Project Not Found | Khaisa Portfolio" };
  }

  return {
    title: `${project.title.EN} | Khaisa Portfolio`,
    description: project.description.EN,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title.EN,
      description: project.description.EN,
      images: [{ url: project.image }],
      type: "website",
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projectsData.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
