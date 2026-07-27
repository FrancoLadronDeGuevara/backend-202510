const productService = require("../services/product.service");

const getAll = (req, res, next) => {
  try {
    const products = productService.getAll();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

const getById = (req, res, next) => {
  try {
    const product = productService.getById(req.params.id);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const create = (req, res, next) => {
  try {
    const product = productService.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const update = (req, res, next) => {
  try {
    const product = productService.update(req.params.id, req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const remove = (req, res, next) => {
  try {
    productService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };
