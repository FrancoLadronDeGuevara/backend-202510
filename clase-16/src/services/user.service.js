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

const getAll = () => {
  const db = readDB("users.json");
  return db.users.map(({ password, ...user }) => user);
};

const getById = (id) => {
  const db = readDB("users.json");

  const user = db.users.find((user) => user.id === id);

  if (!user) {
    const error = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const update = (id, fields) => {
  const db = readDB("users.json");

  const index = db.users.findIndex((user) => user.id === id);

  if (index === -1) {
    const error = new Error("No se encontró el usuario");
    error.status = 404;
    throw error;
  }

  db.users[index] = { ...db.users[index], ...fields, id };

  writeDB("users.json", db);

  const { password, ...userWithoutPassword } = db.users[index];
  return userWithoutPassword;
};

const remove = (id) => {
  const db = readDB("users.json");

  const index = db.users.findIndex((user) => user.id === id);

  if (index === -1) {
    const error = new Error("No se encontró el usuario");
    error.status = 404;
    throw error;
  }

  db.users.splice(index, 1);
  writeDB("users.json", db);
};

module.exports = { register, login, getAll, getById, update, remove };
