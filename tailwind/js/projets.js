const STORAGE_KEY = "portfolio_projects";
const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20viewBox%3D%270%200%201200%20700%27%3E%3Crect%20width%3D%271200%27%20height%3D%27700%27%20fill%3D%27%230f172a%27/%3E%3Ctext%20x%3D%27600%27%20y%3D%27350%27%20font-size%3D%2758%27%20text-anchor%3D%27middle%27%20fill%3D%27%23cbd5e1%27%20font-family%3D%27Arial%2Csans-serif%27%3EProjet%20Ajoute%3C/text%3E%3C/svg%3E";

document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("user-projects-section");
  const grid = document.getElementById("user-projects-grid");
  if (!section || !grid) {
    return;
  }

  const projects = readProjects();
  if (projects.length === 0) {
    return;
  }

  const sortedProjects = [...projects].sort((a, b) => {
    const aDate = Date.parse(String(a.dateSoumission || ""));
    const bDate = Date.parse(String(b.dateSoumission || ""));
    return bDate - aDate;
  });

  grid.innerHTML = "";
  sortedProjects.forEach((project) => {
    grid.appendChild(buildProjectCard(project));
  });
  section.classList.remove("hidden");
});

function readProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function buildProjectCard(project) {
  const article = document.createElement("article");
  article.className =
    "overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/45 shadow-2xl shadow-slate-950/40";

  const image = document.createElement("img");
  image.className = "h-64 w-full object-cover";
  image.alt = project.libelle || "Projet ajoute";
  image.src =
    project.imageDataUrl && project.imageDataUrl.startsWith("data:image/")
      ? project.imageDataUrl
      : FALLBACK_IMAGE;
  article.appendChild(image);

  const body = document.createElement("div");
  body.className = "p-6";

  const label = document.createElement("p");
  label.className = "text-xs font-bold uppercase tracking-[0.3em] text-cyan-300";
  label.textContent = "Projet ajoute";
  body.appendChild(label);

  const title = document.createElement("h3");
  title.className = "mt-3 text-2xl font-black text-white";
  title.textContent = String(project.libelle || "Sans titre");
  body.appendChild(title);

  const description = document.createElement("p");
  description.className = "mt-4 text-slate-300";
  description.textContent = truncateText(String(project.description || ""), 220);
  body.appendChild(description);

  const tags = document.createElement("div");
  tags.className = "mt-5 flex flex-wrap gap-2 text-sm";
  const techList = Array.isArray(project.technologies) ? project.technologies : [];
  techList.forEach((tech) => {
    const tag = document.createElement("span");
    tag.className = "rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-2";
    tag.textContent = String(tech);
    tags.appendChild(tag);
  });
  body.appendChild(tags);

  if (project.dateSoumission) {
    const date = document.createElement("p");
    date.className = "mt-5 text-xs text-slate-400";
    date.textContent = `Ajoute le ${formatDate(project.dateSoumission)}`;
    body.appendChild(date);
  }

  article.appendChild(body);
  return article;
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 1)}...`;
}

function formatDate(isoDateString) {
  const date = new Date(isoDateString);
  if (Number.isNaN(date.getTime())) {
    return "date inconnue";
  }
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
