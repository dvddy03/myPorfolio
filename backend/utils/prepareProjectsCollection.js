import Project from "../models/Project.js";

async function prepareProjectsCollection() {
  try {
    const indexExists = await Project.collection.indexExists("slug_1");

    if (indexExists) {
      await Project.collection.dropIndex("slug_1");
      console.log("Ancien index slug_1 supprime.");
    }
  } catch (err) {
    // La collection n est pas encore creee (premiere execution) - pas un probleme
    console.log("Collection projects non existante, elle sera creee au premier insert.");
  }
}

export default prepareProjectsCollection;
