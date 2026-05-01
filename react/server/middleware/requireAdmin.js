import { verifyAdminToken } from "../utils/auth.js";

function requireAdmin(req, _res, next) {
  try {
    const token = req.cookies?.portfolio_admin_token;

    if (!token) {
      const error = new Error("Authentification requise.");
      error.status = 401;
      throw error;
    }

    req.admin = verifyAdminToken(token);
    next();
  } catch (error) {
    error.status = error.status || 401;
    next(error);
  }
}

export default requireAdmin;
