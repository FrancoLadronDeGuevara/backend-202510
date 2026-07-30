const { Router } = require("express");

const contactsController = require("../controllers/contacts.controller");

const { validate } = require("../middlewares/validate.middleware");
const { authenticate } = require("../middlewares/auth.middleware");

const {
  contactSchema,
  updateContactSchema,
} = require("../schemas/contacts.schema");

const router = Router();

router.get("/", contactsController.getAll);

router.post(
  "/",
  authenticate,
  validate(contactSchema),
  contactsController.create
);

router.put(
  "/:id",
  authenticate,
  validate(updateContactSchema),
  contactsController.update
);

router.delete("/:id", authenticate, contactsController.remove);

module.exports = router;
