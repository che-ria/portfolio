import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Footer } from "@/components/Footer";
import { ProjectGallery } from "@/components/ProjectGallery";
import { projectImages, projects } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.id === slug);
  return project ? { title: project.title, description: project.description } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.id === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const previous = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;

  return <main id="content" className="project-page textured-section">
    <nav className="project-switcher" aria-label="Project navigation">
      {previous ? <Link href={`/projects/${previous.id}`} aria-label={`Previous project: ${previous.title}`}><FiArrowLeft aria-hidden="true" /><small>Previous</small></Link> : <span aria-hidden="true" />}
      <div><h1>{project.title}</h1></div>
      {next ? <Link href={`/projects/${next.id}`} aria-label={`Next project: ${next.title}`}><small>Next</small><FiArrowRight aria-hidden="true" /></Link> : <span aria-hidden="true" />}
    </nav>
    <ProjectGallery images={projectImages[project.id]} title={project.title} />
    <div className="project-back"><Link className="ornate-button" href="/"><FiArrowLeft aria-hidden="true" /> All projects</Link></div>
    <Footer />
  </main>;
}
