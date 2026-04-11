const STORAGE_KEY = "portfolio_projects";
const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/svg+xml"]);

document.addEventListener("DOMContentLoaded", () => {
  const refs = getRefs();
  bindEvents(refs);
  renderInitialState(refs);
});

function getRefs() {
  return {
    form: document.getElementById("project-form"),
    libelle: document.getElementById("libelle"),
    description: document.getElementById("description"),
    technologies: document.getElementById("technologies"),
    image: document.getElementById("image"),
    submitButton: document.getElementById("submit-button"),
    resetButton: document.getElementById("reset-button"),
    clearStorageButton: document.getElementById("clear-storage-button"),
    messageBox: document.getElementById("form-message"),
    techPreview: document.getElementById("tech-preview"),
    imagePreviewWrapper: document.getElementById("image-preview-wrapper"),
    imagePreview: document.getElementById("image-preview"),
    imagePreviewCaption: document.getElementById("image-preview-caption"),
    jsonOutput: document.getElementById("json-output"),
    libelleCount: document.getElementById("libelle-count"),
    descriptionCount: document.getElementById("description-count"),
  };
}

function bindEvents(refs) {
  refs.libelle.addEventListener("input", () => updateCounter(refs.libelle, refs.libelleCount, 90));
  refs.description.addEventListener("input", () =>
    updateCounter(refs.description, refs.descriptionCount, 1200),
  );

  refs.technologies.addEventListener("input", () => {
    const techList = parseTechnologies(refs.technologies.value);
    renderTechnologyPreview(techList, refs.techPreview);
  });

  refs.image.addEventListener("change", () => {
    const imageValidation = validateImage(refs.image.files[0]);
    if (!imageValidation.valid) {
      refs.image.value = "";
      clearImagePreview(refs);
      showMessage(refs.messageBox, imageValidation.message, "error");
      return;
    }

    clearMessage(refs.messageBox);
    renderImagePreview(refs.image.files[0], refs);
  });

  refs.resetButton.addEventListener("click", () => {
    clearMessage(refs.messageBox);
    renderTechnologyPreview([], refs.techPreview);
    clearImagePreview(refs);
    updateCounter(refs.libelle, refs.libelleCount, 90);
    updateCounter(refs.description, refs.descriptionCount, 1200);
  });

  refs.clearStorageButton.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    refs.jsonOutput.textContent = "Aucun envoi pour le moment.";
    showMessage(refs.messageBox, "Historique local supprime.", "success");
  });

  refs.form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(refs.messageBox);

    if (!refs.form.reportValidity()) {
      showMessage(refs.messageBox, "Merci de verifier les champs du formulaire.", "error");
      return;
    }

    setSubmittingState(refs, true);

    let payload;
    try {
      payload = await buildPayload(refs);
    } catch (error) {
      setSubmittingState(refs, false);
      showMessage(refs.messageBox, "Impossible de traiter l'image selectionnee.", "error");
      return;
    }

    const businessValidation = validatePayload(payload);
    if (!businessValidation.valid) {
      setSubmittingState(refs, false);
      showMessage(refs.messageBox, businessValidation.message, "error");
      return;
    }

    saveProject(payload);
    refs.jsonOutput.textContent = JSON.stringify(payload, null, 2);
    showMessage(refs.messageBox, "Projet enregistre avec succes.", "success");

    refs.form.reset();
    renderTechnologyPreview([], refs.techPreview);
    clearImagePreview(refs);
    updateCounter(refs.libelle, refs.libelleCount, 90);
    updateCounter(refs.description, refs.descriptionCount, 1200);
    setSubmittingState(refs, false);
  });
}

function renderInitialState(refs) {
  const projects = readProjects();
  if (projects.length === 0) {
    refs.jsonOutput.textContent = "Aucun envoi pour le moment.";
  } else {
    refs.jsonOutput.textContent = JSON.stringify(projects[projects.length - 1], null, 2);
  }

  updateCounter(refs.libelle, refs.libelleCount, 90);
  updateCounter(refs.description, refs.descriptionCount, 1200);
}

async function buildPayload(refs) {
  const formData = new FormData(refs.form);
  const selectedImage = refs.image.files[0] || null;
  const imageDataUrl = selectedImage ? await readFileAsDataUrl(selectedImage) : "";
  return {
    libelle: String(formData.get("libelle") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    technologies: parseTechnologies(String(formData.get("technologies") || "")),
    image: selectedImage?.name || "",
    imageDataUrl,
    dateSoumission: new Date().toISOString(),
  };
}

function parseTechnologies(rawValue) {
  const seen = new Set();
  return rawValue
    .split(",")
    .map((item) => item.trim())
    .filter((item) => {
      if (!item) {
        return false;
      }
      const normalized = item.toLowerCase();
      if (seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    });
}

function validatePayload(payload) {
  if (payload.technologies.length === 0) {
    return { valid: false, message: "Ajoutez au moins une technologie." };
  }

  if (!payload.image) {
    return { valid: false, message: "Ajoutez une image de projet." };
  }

  const duplicate = readProjects().some(
    (project) => String(project.libelle || "").trim().toLowerCase() === payload.libelle.toLowerCase(),
  );
  if (duplicate) {
    return { valid: false, message: "Un projet avec ce libelle existe deja." };
  }

  return { valid: true, message: "" };
}

function validateImage(file) {
  if (!file) {
    return { valid: false, message: "Selectionnez une image valide (PNG, JPG, SVG)." };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { valid: false, message: "Format invalide. Utilisez PNG, JPG ou SVG." };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { valid: false, message: "Image trop lourde. Taille maximale: 4 Mo." };
  }

  return { valid: true, message: "" };
}

function renderTechnologyPreview(technologies, container) {
  container.innerHTML = "";
  technologies.forEach((technology) => {
    const tag = document.createElement("span");
    tag.className =
      "inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-200";
    tag.textContent = technology;
    container.appendChild(tag);
  });
}

function renderImagePreview(file, refs) {
  const objectUrl = URL.createObjectURL(file);
  refs.imagePreview.src = objectUrl;
  refs.imagePreviewCaption.textContent = `${file.name} - ${Math.ceil(file.size / 1024)} Ko`;
  refs.imagePreviewWrapper.classList.remove("hidden");
  refs.imagePreview.onload = () => URL.revokeObjectURL(objectUrl);
}

function clearImagePreview(refs) {
  refs.imagePreview.src = "";
  refs.imagePreviewCaption.textContent = "";
  refs.imagePreviewWrapper.classList.add("hidden");
}

function readProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveProject(payload) {
  const projects = readProjects();
  projects.push(payload);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Impossible de lire le fichier image."));
    reader.readAsDataURL(file);
  });
}

function updateCounter(input, counter, max) {
  counter.textContent = `${input.value.length}/${max} caracteres`;
}

function setSubmittingState(refs, isSubmitting) {
  refs.submitButton.disabled = isSubmitting;
  refs.resetButton.disabled = isSubmitting;
  refs.clearStorageButton.disabled = isSubmitting;
  refs.submitButton.textContent = isSubmitting ? "Enregistrement..." : "Valider le projet";
}

function showMessage(container, text, type) {
  container.textContent = text;
  container.classList.remove("hidden");
  if (type === "success") {
    container.className =
      "rounded-2xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300";
    return;
  }

  container.className =
    "rounded-2xl border border-rose-300/40 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-200";
}

function clearMessage(container) {
  container.textContent = "";
  container.className = "hidden rounded-2xl border px-4 py-3 text-sm font-semibold";
}
