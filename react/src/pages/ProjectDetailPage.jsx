import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteProject } from "../services/projectService";
import TechBadge from "../components/TechBadge";
import { useProjects } from "../hooks/useProjects";
import { getProjectImage } from "../utils/assets";

function ProjectDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { projects, loading, error } = useProjects();
  const project = projects.find((item) => item.slug === slug);
  const imageSrc = project ? getProjectImage(project) : "";

  async function handleDelete() {
    if (!project) {
      return;
    }

    const confirmed = window.confirm(`Supprimer le projet "${project.title}" ?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(project.slug);
      navigate("/projets");
    } catch (deleteError) {
      window.alert(
        deleteError instanceof Error ? deleteError.message : "Suppression impossible.",
      );
    }
  }

  if (loading) {
    return <p className="status-card">Chargement du detail du projet...</p>;
  }

  if (error) {
    return <p className="status-card status-error">{error}</p>;
  }

  if (!project) {
    return (
      <div className="empty-state">
        <h2>Projet introuvable</h2>
        <p>Le slug demande n'existe pas dans la base JSON ni dans le stockage local.</p>
        <Link className="button-primary" to="/projets">
          Retour aux projets
        </Link>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className={`detail-hero detail-${project.coverTone}`}>
        <div>
          <p className="eyebrow">{project.category}</p>
          <h2>{project.title}</h2>
          <p className="lead">{project.description}</p>
        </div>

        {imageSrc ? (
          <img className="detail-image" src={imageSrc} alt={project.title} />
        ) : (
          <div className="detail-meta">
            <span>Statut: {project.status}</span>
            <span>Annee: {project.year}</span>
            <span>Technologies: {project.technologies.length}</span>
          </div>
        )}
      </section>

      {imageSrc ? (
        <section className="section-panel detail-meta-panel">
          <div className="detail-meta">
            <span>Statut: {project.status}</span>
            <span>Annee: {project.year}</span>
            <span>Technologies: {project.technologies.length}</span>
          </div>
        </section>
      ) : null}

      <section className="detail-grid">
        <article className="section-panel">
          <h3>Technologies</h3>
          <div className="tech-list">
            {project.technologies.map((technology) => (
              <TechBadge key={technology} label={technology} />
            ))}
          </div>
        </article>

        <article className="section-panel">
          <h3>Points forts</h3>
          <ul className="detail-list">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section-panel">
        <h3>Liens</h3>
        <div className="link-row">
          {project.githubUrl ? (
            <a className="button-secondary" href={project.githubUrl} target="_blank" rel="noreferrer">
              Consulter le depot
            </a>
          ) : (
            <span className="muted-pill">Depot GitHub non renseigne</span>
          )}

          {project.demoUrl ? (
            <a className="button-primary" href={project.demoUrl} target="_blank" rel="noreferrer">
              Voir la demo
            </a>
          ) : (
            <span className="muted-pill">Demo non fournie</span>
          )}
        </div>

        <div className="link-row top-spacing">
          <Link className="button-secondary" to={`/projets/${project.slug}/modifier`}>
            Modifier le projet
          </Link>
          <button className="button-danger" type="button" onClick={handleDelete}>
            Supprimer le projet
          </button>
        </div>
      </section>
    </div>
  );
}

export default ProjectDetailPage;
