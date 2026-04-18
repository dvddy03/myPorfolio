import seedDatabase from "../../db.json";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const CREATED_STORAGE_KEY = "portfolio_react_projects";
const OVERRIDES_STORAGE_KEY = "portfolio_react_project_overrides";
const DELETED_STORAGE_KEY = "portfolio_react_deleted_projects";

export async function getProjects() {
  const createdProjects = readJsonStorage(CREATED_STORAGE_KEY, []);
  const overrides = readJsonStorage(OVERRIDES_STORAGE_KEY, {});
  const deletedSlugs = new Set(readJsonStorage(DELETED_STORAGE_KEY, []));
  const baseProjects = await readBaseProjects();

  return buildProjectCollection(baseProjects, createdProjects, overrides, deletedSlugs);
}

export async function getProjectBySlug(slug) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) || null;
}

export async function createProject(values) {
  const existingProjects = await getProjects();
  const normalizedProject = normalizeProject(values, existingProjects);

  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(normalizedProject),
    });

    if (!response.ok) {
      throw new Error("API indisponible");
    }

    return await response.json();
  } catch (error) {
    const createdProjects = readJsonStorage(CREATED_STORAGE_KEY, []);
    createdProjects.push(normalizedProject);
    writeJsonStorage(CREATED_STORAGE_KEY, createdProjects);
    removeDeletedSlug(normalizedProject.slug);
    return normalizedProject;
  }
}

export async function updateProject(currentSlug, values) {
  const projects = await getProjects();
  const currentProject = projects.find((project) => project.slug === currentSlug);

  if (!currentProject) {
    throw new Error("Projet introuvable.");
  }

  const otherProjects = projects.filter((project) => project.slug !== currentSlug);
  const normalizedProject = normalizeProject(
    {
      ...currentProject,
      ...values,
      id: currentProject.id,
      createdAt: currentProject.createdAt,
      slug: values.slug || currentProject.slug,
    },
    otherProjects,
  );

  try {
    const response = await fetch(`${API_BASE_URL}/projects/${currentProject.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(normalizedProject),
    });

    if (!response.ok) {
      throw new Error("API indisponible");
    }

    return await response.json();
  } catch (error) {
    const createdProjects = readJsonStorage(CREATED_STORAGE_KEY, []);
    const createdIndex = createdProjects.findIndex((project) => project.slug === currentSlug);

    if (createdIndex >= 0) {
      createdProjects[createdIndex] = normalizedProject;
      writeJsonStorage(CREATED_STORAGE_KEY, createdProjects);
    } else {
      const overrides = readJsonStorage(OVERRIDES_STORAGE_KEY, {});
      overrides[currentSlug] = normalizedProject;
      if (normalizedProject.slug !== currentSlug) {
        overrides[normalizedProject.slug] = normalizedProject;
      }
      writeJsonStorage(OVERRIDES_STORAGE_KEY, overrides);
    }

    if (normalizedProject.slug !== currentSlug) {
      markDeletedSlug(currentSlug);
    } else {
      removeDeletedSlug(currentSlug);
    }

    return normalizedProject;
  }
}

export async function deleteProject(slug) {
  const projects = await getProjects();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    throw new Error("Projet introuvable.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/projects/${project.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("API indisponible");
    }
  } catch (error) {
    const createdProjects = readJsonStorage(CREATED_STORAGE_KEY, []).filter(
      (item) => item.slug !== slug,
    );
    writeJsonStorage(CREATED_STORAGE_KEY, createdProjects);

    const overrides = readJsonStorage(OVERRIDES_STORAGE_KEY, {});
    delete overrides[slug];
    writeJsonStorage(OVERRIDES_STORAGE_KEY, overrides);

    markDeletedSlug(slug);
  }
}

async function readBaseProjects() {
  try {
    const response = await fetch(`${API_BASE_URL}/projects`);
    if (!response.ok) {
      throw new Error("API indisponible");
    }
    return await response.json();
  } catch (error) {
    return seedDatabase.projects;
  }
}

function buildProjectCollection(baseProjects, createdProjects, overrides, deletedSlugs) {
  const projectMap = new Map();
  const overrideProjects = Object.values(overrides);

  [...baseProjects, ...createdProjects, ...overrideProjects]
    .map((project) => {
      const normalizedProject = normalizeProject(project);
      return overrides[normalizedProject.slug] || normalizedProject;
    })
    .filter((project) => !deletedSlugs.has(project.slug))
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .forEach((project) => {
      if (!projectMap.has(project.slug)) {
        projectMap.set(project.slug, project);
      }
    });

  return [...projectMap.values()];
}

function readJsonStorage(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallbackValue;
  } catch (error) {
    return fallbackValue;
  }
}

function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function markDeletedSlug(slug) {
  const deletedSlugs = new Set(readJsonStorage(DELETED_STORAGE_KEY, []));
  deletedSlugs.add(slug);
  writeJsonStorage(DELETED_STORAGE_KEY, [...deletedSlugs]);
}

function removeDeletedSlug(slug) {
  const deletedSlugs = new Set(readJsonStorage(DELETED_STORAGE_KEY, []));
  deletedSlugs.delete(slug);
  writeJsonStorage(DELETED_STORAGE_KEY, [...deletedSlugs]);
}

function normalizeProject(values, existingProjects = []) {
  const title = String(values.title || "").trim();
  const requestedSlug = String(values.slug || "").trim();
  const baseSlug = slugify(requestedSlug || title || "projet-react");
  const slug = ensureUniqueSlug(baseSlug, existingProjects, values.slug ? values.slug : "");
  const technologies = Array.isArray(values.technologies)
    ? values.technologies
    : String(values.technologies || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
  const highlights = Array.isArray(values.highlights)
    ? values.highlights
    : String(values.highlights || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

  return {
    id: Number(values.id) || Date.now(),
    slug,
    title,
    summary: String(values.summary || "").trim(),
    description: String(values.description || "").trim(),
    category: String(values.category || "Projet").trim(),
    year: String(values.year || new Date().getUTCFullYear()),
    status: String(values.status || "Nouveau").trim(),
    coverTone: String(values.coverTone || "ocean").trim(),
    imageKey: String(values.imageKey || "").trim(),
    imageUrl: String(values.imageUrl || "").trim(),
    technologies,
    highlights,
    githubUrl: String(values.githubUrl || "").trim(),
    demoUrl: String(values.demoUrl || "").trim(),
    createdAt: String(values.createdAt || new Date().toISOString()),
  };
}

function ensureUniqueSlug(baseSlug, existingProjects, currentSlug) {
  const existingSlugs = new Set(
    existingProjects.map((project) => project.slug).filter((slug) => slug !== currentSlug),
  );

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug;
  }

  let index = 2;
  while (existingSlugs.has(`${baseSlug}-${index}`)) {
    index += 1;
  }
  return `${baseSlug}-${index}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
