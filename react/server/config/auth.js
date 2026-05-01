const authConfig = {
  adminEmail: String(process.env.ADMIN_EMAIL || "").trim().toLowerCase(),
  adminPasswordHash: String(process.env.ADMIN_PASSWORD_HASH || "").trim(),
  cookieName: "portfolio_admin_token",
  jwtExpiresIn: "12h",
  jwtSecret: String(process.env.JWT_SECRET || "").trim(),
};

export default authConfig;
