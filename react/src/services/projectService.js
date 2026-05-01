const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export async function getProjects() {
  return requestJson("/projects");
}

export async function getProjectBySlug(slug) {
  return requestJson(`/projects/slug/${encodeURIComponent(slug)}`);
}

export async function createProject(values) {
  const normalizedProject = normalizeProject(values);
  return requestJson("/projects", {
    method: "POST",
    body: JSON.stringify(normalizedProject),
  });
}

export async function updateProject(currentSlug, values) {
  const normalizedProject = normalizeProject(
    {
      ...values,
      slug: values.slug || currentSlug,
    },
  );
  return requestJson(`/projects/slug/${encodeURIComponent(currentSlug)}`, {
    method: "PUT",
    body: JSON.stringify(normalizedProject),
  });
}

export async function deleteProject(slug) {
  return requestWithoutBody(`/projects/slug/${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });
}

function normalizeProject(values) {
  const title = String(values.title || "").trim();
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
    slug: String(values.slug || "").trim(),
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

async function requestJson(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (_error) {
    throw new Error("API Express indisponible. Verifiez le serveur et MongoDB.");
  }

  if (!response.ok) {
    throw await buildRequestError(response);
  }

  return response.json();
}

async function requestWithoutBody(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      ...options,
    });
  } catch (_error) {
    throw new Error("API Express indisponible. Verifiez le serveur et MongoDB.");
  }

  if (!response.ok) {
    throw await buildRequestError(response);
  }
}

async function buildRequestError(response) {
  let message = "API indisponible.";

  try {
    const payload = await response.json();
    if (payload.message) {
      message = payload.message;
    }
  } catch (_error) {
    if (response.status === 404) {
      message = "Projet introuvable.";
    }
  }

  return new Error(message);
}
