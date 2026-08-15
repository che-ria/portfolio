import Link from "next/link";
import { Footer } from "@/components/Footer";
import { MediaImage } from "@/components/MediaImage";
import { projects } from "@/data/site";

export default function ProjectsPage() {
  return <main id="content" className="projects-page">
    <section className="projects-grid" aria-label="Selected projects">
      {projects.map((project, index) => <Link id={project.id} className="project-card" href={`/projects/${project.id}`} key={project.id} aria-label={`Open project: ${project.title}`}>
        {/* Only the first cover is preloaded. It is the Largest Contentful Paint
            element on every viewport, and a second hint in the head would just
            put two images in a race for the same early bandwidth — the case the
            Next docs warn against. The rest stay lazy: the ones sharing the fold
            are fetched as soon as layout runs anyway, and the ones below it
            should not be fetched at all until they are approached. */}
        <MediaImage className="project-card-cover" src={project.cover} alt="" fill preload={index === 0} sizes="(max-width: 700px) 100vw, 700px" />
        <span className="project-card-shade" />
        {project.logo ? <span className="project-card-logo" style={project.logoHeight ? { height: `${project.logoHeight}%` } : undefined}><MediaImage src={project.logo} alt={project.title} fill sizes="(max-width: 700px) 62vw, 430px" /></span> : <span className="project-card-title">{project.title}</span>}
      </Link>)}
    </section>
    <Footer />
  </main>;
}
