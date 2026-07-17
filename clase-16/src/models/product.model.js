const { v4: uuidv4 } = require("uuid");

const createProduct = ({ name, description, price, stock }) => ({
  id: uuidv4(),
  name,
  description,
  price,
  stock,
  createAt: new Date().toISOString(),
});

module.exports = { createProduct };
