import { projects } from "@/data/projects";

export function InvPanel() {
  return (
    <section className="panel">
      <h2>Project Inventory</h2>
      <div className="projectGrid">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.notionUrl}
            target="_blank"
            rel="noreferrer"
            className="projectCard"
          >
            <div className="projectIcon" aria-hidden>
              ⬢
            </div>
            <div>
              <h3>{project.title}</h3>
              <p className="muted">{project.status}</p>
              <p>{project.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
