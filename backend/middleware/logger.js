function logger(req, _res, next) {
  const date = new Date().toISOString();
  console.log(`[${date}] ${req.method} ${req.url}`);
  next();
}

export default logger;
