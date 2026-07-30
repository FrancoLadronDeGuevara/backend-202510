const { z } = require("zod");

const contactSchema = z.object({
  name: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  email: z.string().email({ message: "El email debe ser válido" }),
  phone: z
    .string()
    .min(10, { message: "El teléfono debe tener al menos 10 dígitos" }),
});

const updateContactSchema = z.object({
  name: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .optional(),
  email: z.string().email({ message: "El email debe ser válido" }).optional(),
  phone: z
    .string()
    .min(10, { message: "El teléfono debe tener al menos 10 dígitos" })
    .optional(),
});

module.exports = { contactSchema, updateContactSchema };
