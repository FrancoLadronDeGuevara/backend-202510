import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
      maxlength: [150, "El nombre no puede superar los 150 caracteres"],
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
      maxlength: [1000, "La descripción no puede superar los 1000 caracteres"],
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La categoría es obligatoria"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Índice de texto para búsqueda
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
