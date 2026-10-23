import { body } from "express-validator";

export const productValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio")
    .isLength({ max: 150 })
    .withMessage("El nombre no puede superar los 150 caracteres"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede superar los 1000 caracteres"),
  body("price")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número positivo"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número entero positivo"),
  body("category")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
    .isMongoId()
    .withMessage("ID de categoría inválido"),
];

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("El nombre no puede superar los 150 caracteres"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede superar los 1000 caracteres"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número positivo"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número entero positivo"),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("ID de categoría inválido"),
];
