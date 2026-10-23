import Category from "../models/Category.js";

//Obtener todas las categorías
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort("name");
    res.json({ success: true, data: { categories, total: categories.length } });
  } catch (error) {
    next(error);
  }
};

// Obtener categoría por ID
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Categoría no encontrada." });
    res.json({ success: true, data: { category } });
  } catch (error) {
    next(error);
  }
};

//Crear categoría
export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "Categoría creada.",
        data: { category },
      });
  } catch (error) {
    next(error);
  }
};

//Actualizar categoría
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Categoría no encontrada." });
    res.json({
      success: true,
      message: "Categoría actualizada.",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

//Eliminar categoría (soft delete)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Categoría no encontrada." });
    res.json({ success: true, message: "Categoría eliminada correctamente." });
  } catch (error) {
    next(error);
  }
};
