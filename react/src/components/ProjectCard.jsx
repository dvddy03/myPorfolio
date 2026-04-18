import { Link } from "react-router-dom";
import TechBadge from "./TechBadge";
import { getProjectImage } from "../utils/assets";

const COVER_LABELS = {
  ocean: "cover-ocean",
  ember: "cover-ember",
  forest: "cover-forest",
  violet: "cover-violet",
  carbon: "cover-carbon",
};

function ProjectCard({ project, onDelete }) {
  const coverClass = COVER_LABELS[project.coverTone] || COVER_LABELS.ocean;
  const imageSrc = getProjectImage(project);

  return (
    <article className="project-card">
      {imageSrc ? (
        <div className="project-media">
          <img className="project-image" src={imageSrc} alt={project.title} />
          <div className="project-media-overlay">
            <span>{project.category}</span>
            <strong>{project.year}</strong>
          </div>
        </div>
      ) : (
        <div className={`project-cover ${coverClass}`}>
          <span>{project.category}</span>
          <strong>{project.year}</strong>
        </div>
      )}

      <div className="project-card-body">
        <p className="project-status">{project.status}</p>
        <h3>{project.title}</h3>
        <p className="project-summary">{project.summary}</p>

        <div className="tech-list">
          {project.technologies.slice(0, 4).map((technology) => (
            <TechBadge key={technology} label={technology} />
          ))}
        </div>

        <div className="card-actions">
          <Link className="primary-link" to={`/projets/${project.slug}`}>
            Voir le detail
          </Link>
          <Link className="button-secondary button-compact" to={`/projets/${project.slug}/modifier`}>
            Modifier
          </Link>
          <button
            className="button-danger button-compact"
            type="button"
            onClick={() => onDelete(project)}
          >
            Supprimer
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
