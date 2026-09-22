const userService = require('../services/userService');

const authController = {
  async register(req, res) {
    try {
      const { email, password, name } = req.validated;

      const user = await userService.register(email, password, name);

      res.status(201).json({
        message: 'Usuario registrado correctamente',
        user,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.validated;

      const result = await userService.login(email, password);

      res.status(200).json({
        message: 'Login exitoso',
        ...result,
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await userService.getUserById(req.user.id);

      res.status(200).json({
        user,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
};

module.exports = authController;
