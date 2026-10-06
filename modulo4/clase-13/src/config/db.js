import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a la DB");
  } catch (error) {
    console.error("Error al conectar a la DB", error.message);
    process.exit();
  }
};
