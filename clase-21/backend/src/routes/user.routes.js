const { Router } = require("express");

const userController = require("../controllers/user.controller");

const { validate } = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");

const { registerSchema, loginSchema } = require("../schemas/user.schema");

const router = Router();

router.post("/register", validate(registerSchema), userController.register);
router.post("/login", validate(loginSchema), userController.login);

module.exports = router;
