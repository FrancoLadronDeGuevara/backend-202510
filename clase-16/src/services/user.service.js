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
