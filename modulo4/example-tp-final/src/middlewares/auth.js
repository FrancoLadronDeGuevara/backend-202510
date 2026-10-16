import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Middleware: verificar token
export const protect = async (req, res, next) => {
  let token;

  //Leer el token del header Authorization: Bearer <token>
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No autorizado. Token no encontrado",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado o inactivo",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "No autorizado. Token no valido o expirado",
    });
  }
};

//Middleware: Restringir por roles
export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "No autorizado. Acceso denegado",
      });
    }

    next();
  };
