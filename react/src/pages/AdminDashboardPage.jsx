import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import { deleteProject } from "../services/projectService";

function AdminDashboardPage() {
  const { admin, signOut } = useAuth();
  const { projects, loading, error, reloadProjects } = useProjects();

  async function handleDelete(project) {
    const confirmed = window.confirm(`Supprimer le projet "${project.title}" ?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(project.slug);
      reloadProjects();
    } catch (deleteError) {
      window.alert(deleteError instanceof Error ? deleteError.message : "Suppression impossible.");
    }
  }

  return (
    <div className="page-stack">
      <section className="section-panel section-split admin-overview">
        <article>
          <p className="eyebrow">Administration</p>
          <h2>Gerer les projets sans exposer les actions sensibles aux visiteurs</h2>
          <p className="lead">
            Vous etes connecte en tant que <strong>{admin?.email}</strong>. Depuis cet espace,
            vous pouvez ajouter, modifier ou supprimer des fiches avant la mise en ligne publique.
          </p>
        </article>

        <article className="admin-actions-panel">
          <Link className="button-primary" to="/admin/projets/nouveau">
            Ajouter un projet
          </Link>
          <button className="button-secondary" type="button" onClick={signOut}>
            Se deconnecter
          </button>
        </article>
      </section>

      {loading ? <p className="status-card">Chargement des projets...</p> : null}
      {error ? <p className="status-card status-error">{error}</p> : null}

      {!loading && !error && projects.length === 0 ? (
        <div className="empty-state">
          <h3>Aucun projet en base</h3>
          <p>Ajoutez votre premiere fiche pour alimenter le portfolio public.</p>
        </div>
      ) : null}

      {!loading && projects.length > 0 ? (
        <section className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              onDelete={handleDelete}
              showAdminActions
            />
          ))}
        </section>
      ) : null}
    </div>
  );
}

export default AdminDashboardPage;
