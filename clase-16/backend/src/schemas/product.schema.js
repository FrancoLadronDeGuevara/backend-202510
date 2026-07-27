const { z } = require("zod");

const createProductSchema = z.object({
  name: z.string().min(1, { message: "El Nombre del Producto es obligatorio" }),
  description: z.string().optional(),
  price: z
    .number({ message: "El Precio debe ser de tipo número" })
    .positive({ message: "El precio debe ser mayor a 0" }),
  stock: z
    .number({ message: "El Stock debe ser de tipo número" })
    .int()
    .nonnegative({ message: "El stock no puede ser negativo" })
    .optional(),
});

const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El Nombre del Producto es obligatorio" })
    .optional(),
  description: z.string().optional(),
  price: z
    .number({ message: "El Precio debe ser de tipo número" })
    .positive({ message: "El precio debe ser mayor a 0" })
    .optional(),
  stock: z
    .number({ message: "El Stock debe ser de tipo número" })
    .int()
    .nonnegative({ message: "El stock no puede ser negativo" })
    .optional(),
});

module.exports = { createProductSchema, updateProductSchema };
