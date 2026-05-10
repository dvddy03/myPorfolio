import "dotenv/config";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import seedDatabase from "../../react/db.json" with { type: "json" };
import prepareProjectsCollection from "../utils/prepareProjectsCollection.js";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const shouldResetCollection = process.argv.includes("--fresh");

if (!MONGODB_URI) {
  console.error("Variable d'environnement MONGODB_URI manquante.");
  process.exit(1);
}

async function seedProjects() {
  await mongoose.connect(MONGODB_URI);
  await prepareProjectsCollection();

  if (shouldResetCollection) {
    await Project.deleteMany({});
  }

  const projects = seedDatabase.projects.map((project) => ({
    slug: project.slug || "",
    title: project.title,
    summary: project.summary,
    description: project.description,
    category: project.category,
    year: project.year,
    status: project.status,
    coverTone: project.coverTone,
    imageKey: project.imageKey || "",
    imageUrl: project.imageUrl || "",
    technologies: Array.isArray(project.technologies) ? project.technologies : [],
    highlights: Array.isArray(project.highlights) ? project.highlights : [],
    githubUrl: project.githubUrl || "",
    demoUrl: project.demoUrl || "",
    createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
  }));

  await Project.insertMany(projects);

  console.log(`${projects.length} projet(s) importes dans MongoDB Atlas.`);
  await mongoose.disconnect();
}

seedProjects().catch(async (error) => {
  console.error("Erreur pendant le seed :", error.message);

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  process.exit(1);
});
