document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("project-form");
  const submitButton = document.getElementById("submit-button");
  const messageBox = document.getElementById("form-message");
  const technologiesInput = document.getElementById("technologies");
  const techPreview = document.getElementById("tech-preview");
  const imageInput = document.getElementById("image");
  const imagePreviewWrapper = document.getElementById("image-preview-wrapper");
  const imagePreview = document.getElementById("image-preview");
  const imagePreviewCaption = document.getElementById("image-preview-caption");
  const jsonOutput = document.getElementById("json-output");

  const savedProjects = readSavedProjects();
  if (savedProjects.length > 0) {
    jsonOutput.textContent = JSON.stringify(savedProjects[savedProjects.length - 1], null, 2);
  } else {
    jsonOutput.textContent = "Aucun envoi pour le moment.";
  }

  technologiesInput.addEventListener("input", () => {
    renderTechnologyPreview(parseTechnologies(technologiesInput.value), techPreview);
  });

  imageInput.addEventListener("change", () => {
    updateImagePreview(imageInput, imagePreviewWrapper, imagePreview, imagePreviewCaption);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage(messageBox);

    if (!form.checkValidity()) {
      form.reportValidity();
      showMessage(messageBox, "Merci de corriger les champs obligatoires.", "error");
      return;
    }

    const technologies = parseTechnologies(technologiesInput.value);
    if (technologies.length === 0) {
      showMessage(messageBox, "Ajoutez au moins une technologie.", "error");
      technologiesInput.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours...";

    const formData = new FormData(form);
    const payload = {
      libelle: String(formData.get("libelle") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      technologies,
      image: imageInput.files[0]?.name || null,
      dateSoumission: new Date().toISOString(),
    };

    try {
      await fakeApiSubmit(payload);
      saveProject(payload);
      jsonOutput.textContent = JSON.stringify(payload, null, 2);
      showMessage(messageBox, "Projet valide et enregistre localement.", "success");

      form.reset();
      techPreview.innerHTML = "";
      imagePreviewWrapper.classList.add("hidden");
      imagePreview.src = "";
      imagePreviewCaption.textContent = "";
    } catch (error) {
      showMessage(messageBox, "Echec de l'envoi. Reessayez.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Valider le projet";
    }
  });
});

function parseTechnologies(rawValue) {
  return rawValue
    .split(",")
    .map((item) => item.trim())
    .filter((item, index, array) => item.length > 0 && array.indexOf(item) === index);
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

function updateImagePreview(input, wrapper, image, caption) {
  const file = input.files[0];
  if (!file) {
    wrapper.classList.add("hidden");
    image.src = "";
    caption.textContent = "";
    return;
  }

  const isImageType = /^image\//.test(file.type);
  if (!isImageType) {
    wrapper.classList.add("hidden");
    image.src = "";
    caption.textContent = "";
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  image.src = objectUrl;
  caption.textContent = `${file.name} - ${Math.ceil(file.size / 1024)} Ko`;
  wrapper.classList.remove("hidden");
  image.onload = () => URL.revokeObjectURL(objectUrl);
}

function fakeApiSubmit(payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!payload.libelle || !payload.description) {
        reject(new Error("Payload invalide"));
        return;
      }
      resolve({ ok: true, status: 201 });
    }, 450);
  });
}

function readSavedProjects() {
  try {
    const raw = localStorage.getItem("portfolio_projects");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function saveProject(project) {
  const projects = readSavedProjects();
  projects.push(project);
  localStorage.setItem("portfolio_projects", JSON.stringify(projects));
}

function showMessage(container, text, type) {
  container.textContent = text;
  container.classList.remove("hidden");
  if (type === "success") {
    container.className =
      "rounded-2xl border border-emerald-300/40 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300";
  } else {
    container.className =
      "rounded-2xl border border-rose-300/40 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-200";
  }
}

function clearMessage(container) {
  container.textContent = "";
  container.className = "hidden rounded-2xl border px-4 py-3 text-sm font-semibold";
}
