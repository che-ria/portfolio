import { projects } from "@/data/site";

export default function Loading() {
  return <main className="projects-page" aria-busy="true" aria-label="Loading projects">
    <div className="projects-grid">
      {projects.map((project) => <span key={project.id} className="project-card is-skeleton" />)}
    </div>
  </main>;
}
