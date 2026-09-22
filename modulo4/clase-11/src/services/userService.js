const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');

const userService = {
  async register(email, password, name) {
    const connection = await getConnection();
    try {
      // Verificar si el usuario ya existe
      const [existingUser] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUser.length > 0) {
        throw new Error('El email ya está registrado');
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar usuario
      const [result] = await connection.execute(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, hashedPassword, name]
      );

      return {
        id: result.insertId,
        email,
        name,
      };
    } finally {
      connection.release();
    }
  },

  async login(email, password) {
    const connection = await getConnection();
    try {
      // Buscar usuario por email
      const [users] = await connection.execute(
        'SELECT id, email, password, name, role FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        throw new Error('Email o contraseña incorrectos');
      }

      const user = users[0];

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Generar JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    } finally {
      connection.release();
    }
  },

  async getUserById(userId) {
    const connection = await getConnection();
    try {
      const [users] = await connection.execute(
        'SELECT id, email, name, role, created_at FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      return users[0];
    } finally {
      connection.release();
    }
  },
};

module.exports = userService;
