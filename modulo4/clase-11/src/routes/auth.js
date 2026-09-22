const express = require('express');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validation');
const { registerSchema, loginSchema } = require('../schemas/validations');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Registro
router.post('/register', validate(registerSchema), authController.register);

// Login
router.post('/login', validate(loginSchema), authController.login);

// Obtener perfil (requiere autenticación)
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
