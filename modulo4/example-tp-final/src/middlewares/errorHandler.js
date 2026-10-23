// Middleware global de manejo de errores
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Error interno del servidor";

  // Error de ID de MongoDB inválido
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Recurso no encontrado. ID inválido: ${err.value}`;
  }

  // Error de campo duplicado (unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    statusCode = 409;
    message = `El campo "${field}" ya está registrado.`;
  }

  // Error de validación de Mongoose
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Error de token JWT
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token inválido.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expirado.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
