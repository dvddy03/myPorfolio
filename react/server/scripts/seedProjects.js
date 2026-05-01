import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import connectToDatabase from "../config/db.js";
import Project from "../models/Project.js";
import { normalizeProjectPayload, slugify } from "../utils/projectPayload.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const seedFilePath = path.resolve(currentDirectory, "../../db.json");
const shouldReset = process.argv.includes("--fresh");

async function seedProjects() {
  await connectToDatabase();

  const rawDatabase = await fs.readFile(seedFilePath, "utf-8");
  const parsedDatabase = JSON.parse(rawDatabase);
  const sourceProjects = Array.isArray(parsedDatabase.projects) ? parsedDatabase.projects : [];

  if (shouldReset) {
    await Project.deleteMany({});
  }

  let importedCount = 0;

  for (const sourceProject of sourceProjects) {
    const normalizedProject = normalizeProjectPayload(sourceProject);
    const slug = slugify(normalizedProject.slug || normalizedProject.title || "projet-react");

    await Project.findOneAndUpdate(
      { slug },
      { ...normalizedProject, slug },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    importedCount += 1;
  }

  console.log(
    shouldReset
      ? `${importedCount} projet(s) reinjecte(s) apres remise a zero.`
      : `${importedCount} projet(s) injecte(s) ou mis a jour dans MongoDB.`,
  );
}

seedProjects()
  .catch((error) => {
    console.error("Echec du seed MongoDB :", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
