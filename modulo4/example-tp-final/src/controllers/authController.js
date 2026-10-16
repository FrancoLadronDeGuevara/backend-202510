import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Genera el token de autenticación
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "El email ya esta registrado",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};
