const express = require('express');
const reviewsController = require('../controllers/reviewsController');
const { validate } = require('../middleware/validation');
const { createReviewSchema } = require('../schemas/validations');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Crear review (requiere autenticación)
router.post('/', authMiddleware, validate(createReviewSchema), reviewsController.createReview);

// Obtener reviews de una película
router.get('/movie/:movieId', reviewsController.getMovieReviews);

// Obtener reviews del usuario autenticado
router.get('/user/my-reviews', authMiddleware, reviewsController.getUserReviews);

// Eliminar review (requiere autenticación)
router.delete('/:reviewId', authMiddleware, reviewsController.deleteReview);

module.exports = router;
