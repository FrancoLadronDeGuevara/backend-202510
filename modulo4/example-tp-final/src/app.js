import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "./middlewares/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message:
      "Demasiadas solicitudes. Por favor, intente nuevamente en 15 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message:
      "Demasiadas intentos de autenticación. Por favor, intente nuevamente en 15 minutos.",
  },
});

app.use("/api", globalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "ShopAPI - E-commerce REST API",
    version: "1.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      products: "/api/products",
      categories: "/api/categories",
      orders: "/api/orders",
    },
  });
});

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/{*path}", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  }
});

app.use(errorHandler);

export default app;
