const { Router } = require("express");
const userController = require("../controllers/user.controller");
const { validate } = require("../middlewares/validate.middleware");
const { registerSchema } = require("../schemas/user.schema");

const router = Router();

router.post("/register", validate(registerSchema), userController.register);

module.exports = router;
