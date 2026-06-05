const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function getProjects() {
  const response = await fetch(`${API_BASE_URL}/projects`);

  if (!response.ok) {
    throw new Error("Impossible de charger les projets.");
  }

  return response.json();
}

export async function getProjectById(id) {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Impossible de charger le projet.");
  }

  return response.json();
}

export async function createProject(values) {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizeProject(values)),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
}

export async function updateProject(id, values) {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizeProject(values)),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
}

export async function deleteProject(id) {
  const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
}

async function readError(response) {
  try {
    const data = await response.json();
    return data.erreur || "Une erreur est survenue.";
  } catch (parseError) {
    console.error("Impossible de parser la reponse erreur :", parseError);
    return "Une erreur est survenue.";
  }
}

function normalizeProject(values) {
  return {
    title: String(values.title || "").trim(),
    summary: String(values.summary || "").trim(),
    description: String(values.description || "").trim(),
    category: String(values.category || "Projet").trim(),
    year: String(values.year || new Date().getUTCFullYear()).trim(),
    status: String(values.status || "Nouveau").trim(),
    coverTone: String(values.coverTone || "ocean").trim(),
    imageKey: String(values.imageKey || "").trim(),
    imageUrl: String(values.imageUrl || "").trim(),
    technologies: String(values.technologies || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    highlights: String(values.highlights || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    githubUrl: String(values.githubUrl || "").trim(),
    demoUrl: String(values.demoUrl || "").trim(),
  };
}
