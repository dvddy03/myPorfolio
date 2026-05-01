import jwt from "jsonwebtoken";
import authConfig from "../config/auth.js";

function createAdminToken(payload) {
  if (!authConfig.jwtSecret) {
    throw new Error("JWT_SECRET manquant.");
  }

  return jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: authConfig.jwtExpiresIn,
  });
}

function verifyAdminToken(token) {
  if (!authConfig.jwtSecret) {
    throw new Error("JWT_SECRET manquant.");
  }

  return jwt.verify(token, authConfig.jwtSecret);
}

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: 12 * 60 * 60 * 1000,
  };
}

export { createAdminToken, getCookieOptions, verifyAdminToken };
