import Product from "../models/Product.js";

// Obtener todos los productos (con filtros y paginación)
export const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sort = "-createdAt",
    } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .populate("createdBy", "name email")
        .skip(skip)
        .limit(Number(limit))
        .sort(sort),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

//Obtener producto por ID
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate("createdBy", "name email");
    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Producto no encontrado." });
    }
    res.json({ success: true, data: { product } });
  } catch (error) {
    next(error);
  }
};

//Crear producto
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user._id,
    });
    await product.populate("category", "name slug");
    res
      .status(201)
      .json({ success: true, message: "Producto creado.", data: { product } });
  } catch (error) {
    next(error);
  }
};

//Actualizar producto
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Producto no encontrado." });
    res.json({
      success: true,
      message: "Producto actualizado.",
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

//Eliminar producto (soft delete)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Producto no encontrado." });
    res.json({ success: true, message: "Producto eliminado correctamente." });
  } catch (error) {
    next(error);
  }
};
