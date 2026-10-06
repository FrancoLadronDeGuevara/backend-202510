import { ZodError } from "zod";
import mongoose from "mongoose";
import { HttpError } from "../utils/httpError.js";

export const notFound = (req, res) => {
  res
    .status(404)
    .json({ message: `Ruta no encontrada ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Datos inválidos",
      errors: err.issues.map((issue) => ({
        field: issues.path.join("."),
        message: issues.message,
      })),
    });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: "Error interno del servidor" });
};
