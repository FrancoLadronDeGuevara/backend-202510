const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Error en el servidor";
  res.status(status).json({ message });
};

module.exports = { errorHandler };
