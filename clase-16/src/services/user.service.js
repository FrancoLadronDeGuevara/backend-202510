const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { readDB, writeDB } = require("../utils/db");

const { createUser } = require("../models/user.model");

const register = async ({ email, password }) => {
  const db = readDB("users.json");

  const exists = db.users.find((user) => user.email === email);

  if (exists) {
    const error = new Error("El email ya se encuentra registrado");
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = createUser({ email, password: hashedPassword });

  db.users.push(newUser);
  writeDB("users.json", db);

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

const login = async ({ email, password }) => {
  const db = readDB("users.json");

  const user = db.users.find((user) => user.email === email);

  if (!user) {
    const error = new Error("Email o password incorrectos");
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Email o password incorrectos");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return { token };
};

module.exports = { register };
