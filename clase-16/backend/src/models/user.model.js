const { v4: uuidv4 } = require("uuid");

const createUser = ({ email, password }) => ({
  id: uuidv4(),
  email,
  password,
  createAt: new Date().toISOString(),
});

module.exports = { createUser };
