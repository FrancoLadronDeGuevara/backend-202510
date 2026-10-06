import { Router } from "express";
import {
  controllerCreateBook,
  controllerGetAllBooks,
  controllerGetBookById,
} from "../controllers/book.controller.js";

const router = Router();

//POST CREAR LIBRO
router.post("/", controllerCreateBook);

//GET PARA OBTENER LIBROS
router.get("/", controllerGetAllBooks);

//GET PARA OBTENER EL LIBRO POR EL ID
router.get("/:id", controllerGetBookById);

//ACTUALIZAR UN LIBRO POR EL ID
//router.put("/:id");

//ELIMINAR UN LIBRO POR EL ID
//router.delete("/:id");

export default router;
