import "dotenv/config";
import createApp from "./app.js";
import connectToDatabase from "./config/db.js";

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectToDatabase();

  const app = createApp();
  app.listen(port, () => {
    console.log(`API Express active sur http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Impossible de demarrer l'API :", error.message);
  process.exit(1);
});
