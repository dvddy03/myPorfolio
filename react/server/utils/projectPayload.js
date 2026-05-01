function normalizeProjectPayload(values) {
  return {
    slug: String(values.slug || "").trim(),
    title: String(values.title || "").trim(),
    summary: String(values.summary || "").trim(),
    description: String(values.description || "").trim(),
    category: String(values.category || "Projet").trim(),
    year: String(values.year || new Date().getUTCFullYear()).trim(),
    status: String(values.status || "Nouveau").trim(),
    coverTone: String(values.coverTone || "ocean").trim(),
    imageKey: String(values.imageKey || "").trim(),
    imageUrl: String(values.imageUrl || "").trim(),
    technologies: normalizeList(values.technologies, ","),
    highlights: normalizeList(values.highlights, "\n"),
    githubUrl: String(values.githubUrl || "").trim(),
    demoUrl: String(values.demoUrl || "").trim(),
    createdAt: values.createdAt || new Date().toISOString(),
  };
}

function normalizeList(value, separator) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export { normalizeProjectPayload, slugify };
