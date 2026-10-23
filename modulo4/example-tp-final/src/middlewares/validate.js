import { validationResult } from "express-validator";

//Middleware que verifica los resultados de express-validator

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Datos inválidos",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  next();
};

export default validate;
