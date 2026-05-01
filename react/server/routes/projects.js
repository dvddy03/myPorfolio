import express from "express";
import Project from "../models/Project.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { normalizeProjectPayload, slugify } from "../utils/projectPayload.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category, search } = req.query;
    const filters = {};

    if (category) {
      filters.category = category;
    }

    if (search) {
      const pattern = new RegExp(escapeRegex(search), "i");
      filters.$or = [
        { title: pattern },
        { summary: pattern },
        { technologies: pattern },
      ];
    }

    const projects = await Project.find(filters).sort({ createdAt: -1 });
    res.json(projects);
  }),
);

router.get(
  "/slug/:slug",
  asyncHandler(async (req, res) => {
    const project = await Project.findOne({ slug: req.params.slug.toLowerCase() });

    if (!project) {
      const error = new Error("Projet introuvable.");
      error.status = 404;
      throw error;
    }

    res.json(project);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (!project) {
      const error = new Error("Projet introuvable.");
      error.status = 404;
      throw error;
    }

    res.json(project);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const payload = await buildProjectPayload(req.body);
    const project = await Project.create(payload);
    res.status(201).json(project);
  }),
);

router.put(
  "/slug/:slug",
  asyncHandler(async (req, res) => {
    const currentProject = await Project.findOne({ slug: req.params.slug.toLowerCase() });

    if (!currentProject) {
      const error = new Error("Projet introuvable.");
      error.status = 404;
      throw error;
    }

    const payload = await buildProjectPayload(
      {
        ...currentProject.toObject(),
        ...req.body,
        createdAt: currentProject.createdAt,
      },
      currentProject.slug,
    );

    const updatedProject = await Project.findByIdAndUpdate(currentProject._id, payload, {
      new: true,
      runValidators: true,
    });

    res.json(updatedProject);
  }),
);

router.delete(
  "/slug/:slug",
  asyncHandler(async (req, res) => {
    const deletedProject = await Project.findOneAndDelete({ slug: req.params.slug.toLowerCase() });

    if (!deletedProject) {
      const error = new Error("Projet introuvable.");
      error.status = 404;
      throw error;
    }

    res.status(204).send();
  }),
);

async function buildProjectPayload(values, currentSlug = "") {
  const normalizedPayload = normalizeProjectPayload(values);
  const requestedSlug = String(values.slug || "").trim();
  const baseSlug = slugify(requestedSlug || normalizedPayload.title || "projet-react");
  const slug = await ensureUniqueSlug(baseSlug, currentSlug);

  return {
    ...normalizedPayload,
    slug,
  };
}

async function ensureUniqueSlug(baseSlug, currentSlug = "") {
  let slug = baseSlug;
  let index = 2;

  while (await slugExists(slug, currentSlug)) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  return slug;
}

async function slugExists(slug, currentSlug) {
  const existingProject = await Project.findOne({ slug }).select("slug");
  return Boolean(existingProject && existingProject.slug !== currentSlug);
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default router;
