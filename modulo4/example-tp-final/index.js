import "dotenv/config";
import connectDB from "./src/config/database.js";
import app from "./src/app.js";

const PORT = process.env.PORT;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
};

start();
