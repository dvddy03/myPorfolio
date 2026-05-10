import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: "Projet" },
  year: { type: String, required: true },
  status: { type: String, default: "Nouveau" },
  coverTone: { type: String, default: "ocean" },
  imageKey: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  technologies: { type: [String], default: [] },
  highlights: { type: [String], default: [] },
  githubUrl: { type: String, default: "" },
  demoUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
