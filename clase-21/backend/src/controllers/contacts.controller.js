const contactService = require("../services/contacts.service");

const getAll = (req, res, next) => {
  try {
    const contacts = contactService.getAll();
    res.json(contacts);
  } catch (err) {
    next(err);
  }
};

const create = (req, res, next) => {
  try {
    const contact = contactService.create(req.body);
    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
};

const update = (req, res, next) => {
  try {
    const contact = contactService.update(req.params.id, req.body);
    res.json(contact);
  } catch (err) {
    next(err);
  }
};

const remove = (req, res, next) => {
  try {
    contactService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create, update, remove };
