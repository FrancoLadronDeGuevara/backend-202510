import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Formato de email inválido")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La constraseña debe tener al menos 6 caracteres"),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Formato de email inválido")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

export const updateUserValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Formato de email inválido")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La constraseña debe tener al menos 6 caracteres"),
];
