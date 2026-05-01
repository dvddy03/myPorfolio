import bcrypt from "bcryptjs";
import express from "express";
import rateLimit from "express-rate-limit";
import asyncHandler from "../middleware/asyncHandler.js";
import authConfig from "../config/auth.js";
import { createAdminToken, getCookieOptions, verifyAdminToken } from "../utils/auth.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Trop de tentatives de connexion. Reessayez dans quelques minutes.",
  },
});

router.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    assertAuthConfiguration();

    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      const error = new Error("Email et mot de passe requis.");
      error.status = 400;
      throw error;
    }

    const isAllowedEmail = email === authConfig.adminEmail;
    const isValidPassword = isAllowedEmail
      ? await bcrypt.compare(password, authConfig.adminPasswordHash)
      : false;

    if (!isAllowedEmail || !isValidPassword) {
      const error = new Error("Identifiants invalides.");
      error.status = 401;
      throw error;
    }

    const token = createAdminToken({
      email,
      role: "admin",
    });

    res.cookie(authConfig.cookieName, token, getCookieOptions());
    res.json({
      authenticated: true,
      admin: {
        email,
        role: "admin",
      },
    });
  }),
);

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const token = req.cookies?.[authConfig.cookieName];

    if (!token) {
      return res.status(401).json({
        authenticated: false,
      });
    }

    try {
      const admin = verifyAdminToken(token);
      return res.json({
        authenticated: true,
        admin,
      });
    } catch (_error) {
      res.clearCookie(authConfig.cookieName, getCookieOptions());
      return res.status(401).json({
        authenticated: false,
      });
    }
  }),
);

router.post(
  "/logout",
  asyncHandler(async (_req, res) => {
    res.clearCookie(authConfig.cookieName, getCookieOptions());
    res.status(204).send();
  }),
);

function assertAuthConfiguration() {
  if (!authConfig.adminEmail || !authConfig.adminPasswordHash || !authConfig.jwtSecret) {
    const error = new Error(
      "Configuration admin incomplete. Verifiez ADMIN_EMAIL, ADMIN_PASSWORD_HASH et JWT_SECRET.",
    );
    error.status = 500;
    throw error;
  }
}

export default router;
