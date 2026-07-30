const { v4: uuidv4 } = require("uuid");

const createContact = ({ name, email, phone }) => ({
  id: uuidv4(),
  name,
  email,
  phone,
  createAt: new Date().toISOString(),
  updateAt: new Date().toISOString(),
});

module.exports = { createContact };
