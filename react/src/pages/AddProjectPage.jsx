import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createProject, getProjectBySlug, updateProject } from "../services/projectService";

const initialForm = {
  title: "",
  summary: "",
  description: "",
  category: "Detection & analyse",
  year: "2026",
  status: "Nouveau",
  coverTone: "ocean",
  imageUrl: "",
  technologies: "",
  highlights: "",
  githubUrl: "",
  demoUrl: "",
};

function AddProjectPage() {
  const { slug } = useParams();
  const isEditMode = Boolean(slug);
  const [formValues, setFormValues] = useState(initialForm);
  const [initialSnapshot, setInitialSnapshot] = useState(initialForm);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    if (!isEditMode) {
      setLoading(false);
      setFormValues(initialForm);
      setInitialSnapshot(initialForm);
      return () => {
        mounted = false;
      };
    }

    async function loadProject() {
      try {
        setLoading(true);
        const project = await getProjectBySlug(slug);

        if (!mounted) {
          return;
        }

        if (!project) {
          setError("Le projet a modifier est introuvable.");
          return;
        }

        const nextValues = {
          title: project.title,
          summary: project.summary,
          description: project.description,
          category: project.category,
          year: project.year,
          status: project.status,
          coverTone: project.coverTone,
          imageUrl: project.imageUrl || "",
          technologies: project.technologies.join(", "),
          highlights: project.highlights.join("\n"),
          githubUrl: project.githubUrl,
          demoUrl: project.demoUrl,
        };

        setFormValues(nextValues);
        setInitialSnapshot(nextValues);
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : "Erreur de chargement.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProject();
    return () => {
      mounted = false;
    };
  }, [isEditMode, slug]);

  async function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validateForm(formValues);
    if (validationMessage) {
      setError(validationMessage);
      setSuccessMessage("");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const savedProject = isEditMode
        ? await updateProject(slug, formValues)
        : await createProject(formValues);

      setSuccessMessage(
        isEditMode ? "Projet mis a jour avec succes." : "Projet cree avec succes.",
      );

      if (!isEditMode) {
        setFormValues(initialForm);
        setInitialSnapshot(initialForm);
      }

      setTimeout(() => {
        navigate(`/projets/${savedProject.slug}`);
      }, 500);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Erreur lors de l'enregistrement.");
      setSuccessMessage("");
    } finally {
      setSubmitting(false);
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  if (loading) {
    return <p className="status-card">Chargement du formulaire...</p>;
  }

  return (
    <div className="page-stack">
      <section className="section-panel">
        <p className="eyebrow">{isEditMode ? "Edition" : "Nouveau projet"}</p>
        <h2>{isEditMode ? "Modifier un projet" : "Ajouter un projet"}</h2>
        <p className="lead">
          {isEditMode
            ? "Ajustez le contenu, les liens et les visuels pour garder un portfolio propre et a jour."
            : "Ajoutez un nouveau projet avec ses informations principales, ses technologies et un visuel."}
        </p>
      </section>

      <form className="project-form-react" onSubmit={handleSubmit}>
        <label className="field-shell field-span-2">
          <span>Titre du projet</span>
          <input
            name="title"
            value={formValues.title}
            onChange={updateField}
            placeholder="Ex : Detection SOC avec Wazuh"
          />
        </label>

        <label className="field-shell field-span-2">
          <span>Resume</span>
          <textarea
            name="summary"
            rows="3"
            value={formValues.summary}
            onChange={updateField}
            placeholder="Une phrase claire sur le projet"
          />
        </label>

        <label className="field-shell field-span-2">
          <span>Description detaillee</span>
          <textarea
            name="description"
            rows="6"
            value={formValues.description}
            onChange={updateField}
            placeholder="Contexte, objectifs, realisation, impact"
          />
        </label>

        <label className="field-shell">
          <span>Categorie</span>
          <select name="category" value={formValues.category} onChange={updateField}>
            <option value="Detection & analyse">Detection & analyse</option>
            <option value="SOC & SIEM">SOC & SIEM</option>
            <option value="Systeme & reseau">Systeme & reseau</option>
            <option value="IoT & embarque">IoT & embarque</option>
          </select>
        </label>

        <label className="field-shell">
          <span>Statut</span>
          <select name="status" value={formValues.status} onChange={updateField}>
            <option value="Nouveau">Nouveau</option>
            <option value="En evolution">En evolution</option>
            <option value="Termine">Termine</option>
          </select>
        </label>

        <label className="field-shell">
          <span>Annee</span>
          <input name="year" value={formValues.year} onChange={updateField} placeholder="2026" />
        </label>

        <label className="field-shell">
          <span>Theme visuel</span>
          <select name="coverTone" value={formValues.coverTone} onChange={updateField}>
            <option value="ocean">Ocean</option>
            <option value="ember">Ember</option>
            <option value="forest">Forest</option>
            <option value="violet">Violet</option>
            <option value="carbon">Carbon</option>
          </select>
        </label>

        <label className="field-shell field-span-2">
          <span>Image du projet</span>
          <input
            name="imageUrl"
            value={formValues.imageUrl}
            onChange={updateField}
            placeholder="https://... ou chemin image accessible"
          />
        </label>

        <label className="field-shell field-span-2">
          <span>Technologies</span>
          <input
            name="technologies"
            value={formValues.technologies}
            onChange={updateField}
            placeholder="React, Vite, Wazuh, Linux"
          />
        </label>

        <label className="field-shell field-span-2">
          <span>Points forts (une ligne par item)</span>
          <textarea
            name="highlights"
            rows="5"
            value={formValues.highlights}
            onChange={updateField}
            placeholder={"Ex :\nDashboard temps reel\nAlertes filtrees\nDocumentation du deploiement"}
          />
        </label>

        <label className="field-shell">
          <span>Depot GitHub</span>
          <input
            name="githubUrl"
            value={formValues.githubUrl}
            onChange={updateField}
            placeholder="https://github.com/..."
          />
        </label>

        <label className="field-shell">
          <span>Lien demo</span>
          <input
            name="demoUrl"
            value={formValues.demoUrl}
            onChange={updateField}
            placeholder="https://..."
          />
        </label>

        {error ? <p className="status-card status-error field-span-2">{error}</p> : null}
        {successMessage ? <p className="status-card field-span-2">{successMessage}</p> : null}

        <div className="field-span-2 action-row">
          <button className="button-primary" type="submit" disabled={submitting}>
            {submitting
              ? "Enregistrement en cours..."
              : isEditMode
                ? "Enregistrer les changements"
                : "Creer le projet"}
          </button>
          <button
            className="button-secondary"
            type="button"
            disabled={submitting}
            onClick={() => {
              setFormValues(isEditMode ? initialSnapshot : initialForm);
              setError("");
              setSuccessMessage("");
            }}
          >
            {isEditMode ? "Annuler les changements" : "Reinitialiser"}
          </button>
          {isEditMode ? (
            <Link className="button-secondary" to={`/projets/${slug}`}>
              Annuler
            </Link>
          ) : null}
        </div>
      </form>
    </div>
  );
}

function validateForm(values) {
  if (values.title.trim().length < 4) {
    return "Le titre doit contenir au moins 4 caracteres.";
  }

  if (values.summary.trim().length < 12) {
    return "Le resume doit etre un peu plus explicite.";
  }

  if (values.description.trim().length < 30) {
    return "La description doit contenir au moins 30 caracteres.";
  }

  const technologies = values.technologies
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (technologies.length === 0) {
    return "Ajoutez au moins une technologie.";
  }

  return "";
}

export default AddProjectPage;
