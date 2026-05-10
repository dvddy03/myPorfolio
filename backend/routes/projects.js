import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      const error = new Error("Projet introuvable.");
      error.status = 404;
      return next(error);
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      const error = new Error("Projet introuvable.");
      error.status = 404;
      return next(error);
    }

    res.json(updatedProject);
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      const error = new Error("Projet introuvable.");
      error.status = 404;
      return next(error);
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
