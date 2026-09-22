const movieService = require('../services/movieService');

const moviesController = {
  async getAllMovies(req, res) {
    try {
      const { genre, search } = req.query;
      const filters = {};

      if (genre) filters.genre = genre;
      if (search) filters.search = search;

      const movies = await movieService.getAllMovies(filters);

      res.status(200).json({
        movies,
        count: movies.length,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getMovieById(req, res) {
    try {
      const { id } = req.params;

      const movie = await movieService.getMovieById(id);

      res.status(200).json(movie);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  async createMovie(req, res) {
    try {
      const { title, description, director, release_year, genre, image_url } = req.validated;
      const userId = req.user.id;

      const movie = await movieService.createMovie(
        title,
        description,
        director,
        release_year,
        genre,
        image_url,
        userId
      );

      res.status(201).json({
        message: 'Película creada correctamente',
        movie,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async updateMovie(req, res) {
    try {
      const { id } = req.params;
      const updates = req.validated;

      const movie = await movieService.updateMovie(id, updates, req.user.id);

      res.status(200).json({
        message: 'Película actualizada correctamente',
        movie,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteMovie(req, res) {
    try {
      const { id } = req.params;

      await movieService.deleteMovie(id);

      res.status(200).json({ message: 'Película eliminada correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getGenres(req, res) {
    try {
      const genres = await movieService.getGenres();

      res.status(200).json({ genres });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = moviesController;
