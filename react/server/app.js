import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import authRouter from "./routes/auth.js";
import projectRouter from "./routes/projects.js";
import errorHandler from "./middleware/errorHandler.js";
import notFoundHandler from "./middleware/notFoundHandler.js";

function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  app.use(
    cors(
      allowedOrigins.length > 0
        ? {
            origin: allowedOrigins,
            credentials: true,
          }
        : undefined,
    ),
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "myportfolio-api",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/projects", projectRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;
