import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El titulo es obligatorio"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "El autor del libro es obligatorio"],
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
      default: "",
    },
    publishedYear: {
      type: Number,
    },
    publisher: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model("Book", bookSchema);
