const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar rutas
const authRoutes = require("./routes/auth");
const moviesRoutes = require("./routes/movies");
const reviewsRoutes = require("./routes/reviews");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Rutas de API
app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/reviews", reviewsRoutes);

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a la API de Películas",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      movies: "/api/movies",
      reviews: "/api/reviews",
    },
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

module.exports = app;
