import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/userValidators.js";
import { protect } from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";

const router = Router();

router.post("/register", registerValidator, validate, register);

router.post("/login", loginValidator, validate, login);

router.get("/me", protect, getMe);

export default router;
