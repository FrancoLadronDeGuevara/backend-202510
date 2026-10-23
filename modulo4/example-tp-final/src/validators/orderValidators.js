import { body } from "express-validator";

export const orderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("La orden debe tener al menos un producto"),
  body("items.*.product")
    .notEmpty()
    .withMessage("Cada item debe tener un producto")
    .isMongoId()
    .withMessage("ID de producto inválido"),
  body("items.*.quantity")
    .notEmpty()
    .withMessage("Cada item debe tener una cantidad")
    .isInt({ min: 1 })
    .withMessage("La cantidad mínima es 1"),
  body("shippingAddress.street")
    .trim()
    .notEmpty()
    .withMessage("La calle es obligatoria"),
  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("La ciudad es obligatoria"),
  body("shippingAddress.zipCode")
    .trim()
    .notEmpty()
    .withMessage("El código postal es obligatorio"),
  body("paymentMethod")
    .optional()
    .isIn(["credit_card", "debit_card", "cash", "transfer"])
    .withMessage("Método de pago inválido"),
];

export const updateOrderStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("El estado es obligatorio")
    .isIn(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .withMessage("Estado inválido"),
];
