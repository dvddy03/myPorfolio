import Project from "../models/Project.js";

async function prepareProjectsCollection() {
  const indexExists = await Project.collection.indexExists("slug_1");

  if (indexExists) {
    await Project.collection.dropIndex("slug_1");
    console.log("Ancien index slug_1 supprime.");
  }
}

export default prepareProjectsCollection;
