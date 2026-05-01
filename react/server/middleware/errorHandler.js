function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  const message = error.message || "Erreur interne du serveur.";

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    message,
  });
}

export default errorHandler;
