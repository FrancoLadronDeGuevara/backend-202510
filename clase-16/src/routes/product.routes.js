const { Router } = require("express");

const productController = require("../controllers/product.controller");

const { validate } = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");

const {
  createProductSchema,
  updateProductSchema,
} = require("../schemas/product.schema");

const router = Router();

router.get("/", productController.getAll);

router.get("/:id", productController.getById);

router.post(
  "/",
  authenticate,
  validate(createProductSchema),
  productController.create
);

router.put(
  "/:id",
  authenticate,
  validate(updateProductSchema),
  productController.update
);

router.delete("/:id", authenticate, productController.remove);

module.exports = router;
