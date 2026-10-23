import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de categoría es obligatorio"],
      unique: true,
      trim: true,
      maxlength: [50, "El nombre no puede superar los 50 caracteres"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "La descripción no puede superar los 200 caracteres"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generar slug automáticamente antes de guardar
categorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");
  }
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
