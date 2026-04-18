import { startTransition, useDeferredValue, useState } from "react";
import { deleteProject } from "../services/projectService";
import ProjectCard from "../components/ProjectCard";
import { useProjects } from "../hooks/useProjects";

const categories = [
  "Toutes",
  "Detection & analyse",
  "SOC & SIEM",
  "Systeme & reseau",
  "IoT & embarque",
];

function ProjectsPage() {
  const { projects, loading, error, reloadProjects } = useProjects();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [actionMessage, setActionMessage] = useState("");
  const deferredSearch = useDeferredValue(search);

  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = category === "Toutes" || project.category === category;
    const matchesSearch =
      normalizedSearch.length === 0 ||
      project.title.toLowerCase().includes(normalizedSearch) ||
      project.summary.toLowerCase().includes(normalizedSearch) ||
      project.technologies.some((technology) =>
        technology.toLowerCase().includes(normalizedSearch),
      );

    return matchesCategory && matchesSearch;
  });

  async function handleDelete(project) {
    const confirmed = window.confirm(`Supprimer le projet "${project.title}" ?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(project.slug);
      setActionMessage("Projet supprime avec succes.");
      reloadProjects();
    } catch (deleteError) {
      setActionMessage(
        deleteError instanceof Error ? deleteError.message : "Suppression impossible.",
      );
    }
  }

  return (
    <div className="page-stack">
      <section className="section-panel">
        <p className="eyebrow">Selection de projets</p>
        <h2>Des realisations techniques presentees de maniere claire et exploitable</h2>
        <p className="lead">
          Explorez vos projets, filtrez-les par domaine, puis modifiez ou supprimez rapidement les
          fiches pour garder un portfolio propre avant publication.
        </p>

        <div className="filters-row">
          <label className="field-shell">
            <span>Recherche</span>
            <input
              type="search"
              value={search}
              onChange={(event) => {
                const nextValue = event.target.value;
                startTransition(() => {
                  setSearch(nextValue);
                });
              }}
              placeholder="Ex : Wazuh, ESP32, reseau"
            />
          </label>

          <label className="field-shell">
            <span>Categorie</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {actionMessage ? <p className="status-card">{actionMessage}</p> : null}

      {loading && <p className="status-card">Chargement des projets...</p>}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="empty-state">
          <h3>Aucun projet ne correspond aux filtres</h3>
          <p>Essayez une autre technologie ou changez de categorie.</p>
        </div>
      )}

      {!loading && filteredProjects.length > 0 && (
        <section className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} onDelete={handleDelete} />
          ))}
        </section>
      )}

      {error ? <p className="status-card status-error">{error}</p> : null}
    </div>
  );
}

export default ProjectsPage;
