require("dotenv").config();

const express = require("express");

const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");

const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});

module.exports = app;
