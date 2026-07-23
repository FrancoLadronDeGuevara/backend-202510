const { readDB, writeDB } = require("../utils/db");
const { createProduct } = require("../models/product.model");

const getAll = () => {
  const db = readDB("products.json");
  return db.products;
};

const getById = (id) => {
  const db = readDB("products.json");

  const product = db.products.find((product) => product.id === id);

  if (!product) {
    const error = new Error("Producto no encontrado");
    error.status = 404;
    throw error;
  }

  return product;
};

const create = (fields) => {
  const db = readDB("products.json");

  const newProduct = createProduct(fields);

  db.products.push(newProduct);

  writeDB("products.json", db);

  return newProduct;
};

const update = (id, fields) => {
  const db = readDB("products.json");

  const index = db.products.findIndex((product) => product.id === id);

  if (index === -1) {
    const error = new Error("Producto no encontrado");
    error.status = 404;
    throw error;
  }

  db.products[index] = { ...db.products[index], ...fields, id };

  writeDB("products.json", db);

  return db.products[index];
};

const remove = (id) => {
  const db = readDB("products.json");

  const index = db.products.findIndex((product) => product.id === id);

  if (index === -1) {
    const error = new Error("Producto no encontrado");
    error.status = 404;
    throw error;
  }

  db.products.splice(index, 1);
  writeDB("products.json", db);
};

module.exports = { getAll, getById, create, update, remove };
