const express = require('express');
const moviesController = require('../controllers/moviesController');
const { validate } = require('../middleware/validation');
const { createMovieSchema, updateMovieSchema } = require('../schemas/validations');
const { authMiddleware, adminMiddleware, optionalAuthMiddleware } = require('../middleware/auth');

const router = express.Router();

// Obtener todas las películas (sin autenticación requerida)
router.get('/', optionalAuthMiddleware, moviesController.getAllMovies);

// Obtener géneros
router.get('/genres', moviesController.getGenres);

// Obtener película por ID
router.get('/:id', optionalAuthMiddleware, moviesController.getMovieById);

// Crear película (requiere ser admin)
router.post('/', authMiddleware, adminMiddleware, validate(createMovieSchema), moviesController.createMovie);

// Actualizar película (requiere ser admin)
router.put('/:id', authMiddleware, adminMiddleware, validate(updateMovieSchema), moviesController.updateMovie);

// Eliminar película (requiere ser admin)
router.delete('/:id', authMiddleware, adminMiddleware, moviesController.deleteMovie);

module.exports = router;
