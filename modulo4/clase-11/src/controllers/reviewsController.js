const reviewService = require('../services/reviewService');

const reviewsController = {
  async createReview(req, res) {
    try {
      const { movie_id, rating, comment } = req.validated;
      const userId = req.user.id;

      const review = await reviewService.createReview(userId, movie_id, rating, comment);

      res.status(201).json({
        message: 'Valoración creada/actualizada correctamente',
        review,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getMovieReviews(req, res) {
    try {
      const { movieId } = req.params;

      const reviews = await reviewService.getMovieReviews(movieId);

      res.status(200).json({
        reviews,
        count: reviews.length,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUserReviews(req, res) {
    try {
      const userId = req.user.id;

      const reviews = await reviewService.getUserReviews(userId);

      res.status(200).json({
        reviews,
        count: reviews.length,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteReview(req, res) {
    try {
      const { reviewId } = req.params;
      const userId = req.user.id;

      await reviewService.deleteReview(reviewId, userId);

      res.status(200).json({ message: 'Valoración eliminada correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = reviewsController;
