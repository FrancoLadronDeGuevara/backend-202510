import {
  createBook,
  getAllBooks,
  getBookById,
} from "../services/book.service.js";
import { HttpError } from "../utils/httpError.js";

export const controllerCreateBook = async (req, res) => {
  const book = await createBook(req.body);

  if (book instanceof HttpError) {
    return res.status(book.status).json({ message: book.message });
  }
  res.status(201).json(book);
};

export const controllerGetAllBooks = async (req, res) => {
  const books = await getAllBooks();
  res.json(books);
};

export const controllerGetBookById = async (req, res) => {
  const book = await getBookById(req.params.id);

  if (!book) return res.status(404).json({ success: "Libro no encontrado" });

  res.json(book);
};
