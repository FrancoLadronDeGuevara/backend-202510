const { getConnection } = require('../config/database');

const reviewService = {
  async createReview(userId, movieId, rating, comment) {
    const connection = await getConnection();
    try {
      // Verificar que la película existe
      const [movies] = await connection.execute(
        'SELECT id FROM movies WHERE id = ?',
        [movieId]
      );

      if (movies.length === 0) {
        throw new Error('Película no encontrada');
      }

      // Insertar o actualizar review
      const [result] = await connection.execute(
        `
        INSERT INTO reviews (user_id, movie_id, rating, comment)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        rating = VALUES(rating),
        comment = VALUES(comment),
        updated_at = NOW()
        `,
        [userId, movieId, rating, comment || null]
      );

      return {
        id: result.insertId,
        user_id: userId,
        movie_id: movieId,
        rating,
        comment,
      };
    } finally {
      connection.release();
    }
  },

  async getMovieReviews(movieId) {
    const connection = await getConnection();
    try {
      const [reviews] = await connection.execute(
        `
        SELECT 
          r.*,
          u.name as user_name,
          u.email as user_email
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.movie_id = ?
        ORDER BY r.created_at DESC
        `,
        [movieId]
      );

      return reviews;
    } finally {
      connection.release();
    }
  },

  async getUserReviews(userId) {
    const connection = await getConnection();
    try {
      const [reviews] = await connection.execute(
        `
        SELECT 
          r.*,
          m.title as movie_title
        FROM reviews r
        LEFT JOIN movies m ON r.movie_id = m.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
        `,
        [userId]
      );

      return reviews;
    } finally {
      connection.release();
    }
  },

  async deleteReview(reviewId, userId) {
    const connection = await getConnection();
    try {
      const [reviews] = await connection.execute(
        'SELECT user_id FROM reviews WHERE id = ?',
        [reviewId]
      );

      if (reviews.length === 0) {
        throw new Error('Review no encontrada');
      }

      if (reviews[0].user_id !== userId) {
        throw new Error('No tienes permisos para eliminar este review');
      }

      await connection.execute(
        'DELETE FROM reviews WHERE id = ?',
        [reviewId]
      );

      return { message: 'Review eliminada correctamente' };
    } finally {
      connection.release();
    }
  },
};

module.exports = reviewService;
