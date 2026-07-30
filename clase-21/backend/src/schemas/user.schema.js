const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email({ message: "Dirección de email inválida" }),
  password: z
    .string()
    .min(6, { message: "La constraseña debe ser de al menos 6 cáracteres" }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Dirección de email inválida" }),
  password: z.string().min(1, { message: "El campo password es obligatorio" }),
});

module.exports = { registerSchema, loginSchema };
