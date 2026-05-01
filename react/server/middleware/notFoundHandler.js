function notFoundHandler(req, _res, next) {
  const error = new Error(`Route introuvable: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export default notFoundHandler;
