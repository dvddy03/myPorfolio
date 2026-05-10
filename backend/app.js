import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import logger from "./middleware/logger.js";
import projectsRouter from "./routes/projects.js";
import prepareProjectsCollection from "./utils/prepareProjectsCollection.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error("Variable d'environnement MONGODB_URI manquante.");
  process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get("/", (_req, res) => {
  res.send("Bonjour depuis Express !");
});

app.use("/api/projects", projectsRouter);

app.use((req, res) => {
  res.status(404).json({ erreur: `Route introuvable : ${req.method} ${req.originalUrl}` });
});

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({ erreur: err.message });
});

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    await prepareProjectsCollection();
    console.log("Connecte a MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Serveur demarre sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur de connexion :", err.message);
    process.exit(1);
  });
