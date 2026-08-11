import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { projects } from "@/data/site";

export default function ProjectsPage() {
  return <main id="content" className="projects-page">
    <section className="projects-grid" aria-label="Selected projects">
      {projects.map((project) => <Link id={project.id} className="project-card" href={`/projects/${project.id}`} key={project.id} aria-label={`Open project: ${project.title}`}>
        <Image className="project-card-cover" src={project.cover} alt="" fill priority={project.id === "cozy-tiny-home" || project.id === "cottonville"} sizes="(max-width: 700px) 100vw, 50vw" />
        <span className="project-card-shade" />
        {project.logo ? <span className="project-card-logo"><Image src={project.logo} alt={project.title} fill sizes="(max-width: 700px) 70vw, 32vw" /></span> : <span className="project-card-title">{project.title}</span>}
      </Link>)}
    </section>
    <Footer />
  </main>;
}
