const { Router } = require("express");

const userController = require("../controllers/user.controller");

const { validate } = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");

const {
  registerSchema,
  loginSchema,
  updateUserSchema,
} = require("../schemas/user.schema");

const router = Router();

router.post("/register", validate(registerSchema), userController.register);
router.post("/login", validate(loginSchema), userController.login);

router.get("/", authenticate, userController.getAll);
router.get("/:id", authenticate, userController.getById);
router.put(
  "/:id",
  authenticate,
  validate(updateUserSchema),
  userController.update
);
router.delete("/:id", authenticate, userController.remove);

module.exports = router;
