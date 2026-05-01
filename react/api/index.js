import createApp from "../server/app.js";
import connectToDatabase from "../server/config/db.js";

const app = createApp();

export default async function handler(req, res) {
  await connectToDatabase();
  return app(req, res);
}
