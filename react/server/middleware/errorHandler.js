function errorHandler(error, _req, res, _next) {
  const status = resolveStatus(error);
  const message = resolveMessage(error);

  if (status >= 500) {
    console.error(error);
  }

  res.status(status).json({
    message,
  });
}

function resolveStatus(error) {
  if (error.status) {
    return error.status;
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return 400;
  }

  if (error.code === 11000) {
    return 409;
  }

  return 500;
}

function resolveMessage(error) {
  if (error.name === "ValidationError") {
    return Object.values(error.errors)
      .map((item) => item.message)
      .join(" ");
  }

  if (error.code === 11000) {
    return "Un projet avec ce slug existe deja.";
  }

  if (error.name === "CastError") {
    return "Identifiant de projet invalide.";
  }

  return error.message || "Erreur interne du serveur.";
}

export default errorHandler;
