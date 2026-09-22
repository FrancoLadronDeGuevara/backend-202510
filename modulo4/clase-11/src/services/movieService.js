const { getConnection } = require('../config/database');

const movieService = {
  async getAllMovies(filters = {}) {
    const connection = await getConnection();
    try {
      let query = `
        SELECT 
          m.*,
          u.name as creator_name,
          AVG(r.rating) as average_rating,
          COUNT(r.id) as review_count
        FROM movies m
        LEFT JOIN users u ON m.created_by = u.id
        LEFT JOIN reviews r ON m.id = r.movie_id
      `;

      const params = [];

      if (filters.genre) {
        query += ' WHERE m.genre = ?';
        params.push(filters.genre);
      }

      if (filters.search) {
        const searchCondition = ' WHERE m.title LIKE ? OR m.description LIKE ?';
        query = query.includes('WHERE')
          ? query + ' AND (m.title LIKE ? OR m.description LIKE ?)'
          : query + searchCondition;
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      query += ' GROUP BY m.id ORDER BY m.created_at DESC';

      const [movies] = await connection.execute(query, params);
      return movies;
    } finally {
      connection.release();
    }
  },

  async getMovieById(movieId) {
    const connection = await getConnection();
    try {
      const [movies] = await connection.execute(
        `
        SELECT 
          m.*,
          u.name as creator_name,
          AVG(r.rating) as average_rating,
          COUNT(r.id) as review_count
        FROM movies m
        LEFT JOIN users u ON m.created_by = u.id
        LEFT JOIN reviews r ON m.id = r.movie_id
        WHERE m.id = ?
        GROUP BY m.id
        `,
        [movieId]
      );

      if (movies.length === 0) {
        throw new Error('Película no encontrada');
      }

      // Obtener reviews
      const [reviews] = await connection.execute(
        `
        SELECT 
          r.*,
          u.name as user_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.movie_id = ?
        ORDER BY r.created_at DESC
        `,
        [movieId]
      );

      return {
        ...movies[0],
        reviews,
      };
    } finally {
      connection.release();
    }
  },

  async createMovie(title, description, director, release_year, genre, image_url, userId) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        `
        INSERT INTO movies (title, description, director, release_year, genre, image_url, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [title, description || null, director || null, release_year || null, genre || null, image_url || null, userId]
      );

      return {
        id: result.insertId,
        title,
        description,
        director,
        release_year,
        genre,
        image_url,
        created_by: userId,
      };
    } finally {
      connection.release();
    }
  },

  async updateMovie(movieId, updates, userId) {
    const connection = await getConnection();
    try {
      // Verificar que el usuario sea el creador o admin
      const [movies] = await connection.execute(
        'SELECT created_by FROM movies WHERE id = ?',
        [movieId]
      );

      if (movies.length === 0) {
        throw new Error('Película no encontrada');
      }

      const keys = Object.keys(updates);
      const values = Object.values(updates);
      const setClause = keys.map(key => `${key} = ?`).join(', ');

      await connection.execute(
        `UPDATE movies SET ${setClause}, updated_at = NOW() WHERE id = ?`,
        [...values, movieId]
      );

      return this.getMovieById(movieId);
    } finally {
      connection.release();
    }
  },

  async deleteMovie(movieId) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        'DELETE FROM movies WHERE id = ?',
        [movieId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Película no encontrada');
      }

      return { message: 'Película eliminada correctamente' };
    } finally {
      connection.release();
    }
  },

  async getGenres() {
    const connection = await getConnection();
    try {
      const [genres] = await connection.execute(
        'SELECT DISTINCT genre FROM movies WHERE genre IS NOT NULL'
      );
      return genres.map(g => g.genre);
    } finally {
      connection.release();
    }
  },
};

module.exports = movieService;
