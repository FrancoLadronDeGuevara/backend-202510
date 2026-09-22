const { z } = require('zod');

// Validación para registro de usuario
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

// Validación para login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña inválida'),
});

// Validación para crear película
const createMovieSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  director: z.string().optional(),
  release_year: z.number().int().optional(),
  genre: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
});

// Validación para crear review
const createReviewSchema = z.object({
  movie_id: z.number().int().positive('Movie ID debe ser un número positivo'),
  rating: z.number().int().min(1, 'Rating mínimo es 1').max(5, 'Rating máximo es 5'),
  comment: z.string().optional(),
});

// Validación para actualizar película
const updateMovieSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  director: z.string().optional(),
  release_year: z.number().int().optional(),
  genre: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
});

module.exports = {
  registerSchema,
  loginSchema,
  createMovieSchema,
  createReviewSchema,
  updateMovieSchema,
};
