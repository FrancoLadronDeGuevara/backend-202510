import Order from "../models/Order.js";
import Product from "../models/Product.js";

//Crear orden
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    // Verificar stock y calcular precio total
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res
          .status(404)
          .json({
            success: false,
            message: `Producto ${item.product} no encontrado.`,
          });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`,
        });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
      totalPrice += product.price * item.quantity;
    }

    // Descontar stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      notes,
    });

    await order.populate([
      { path: "items.product", select: "name price images" },
      { path: "user", select: "name email" },
    ]);

    res
      .status(201)
      .json({
        success: true,
        message: "Orden creada exitosamente.",
        data: { order },
      });
  } catch (error) {
    next(error);
  }
};

// Obtener todas las órdenes
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("user", "name email")
        .populate("items.product", "name price")
        .skip(skip)
        .limit(Number(limit))
        .sort("-createdAt"),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        orders,
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

//Obtener mis órdenes (usuario autenticado)
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price images")
      .sort("-createdAt");
    res.json({ success: true, data: { orders, total: orders.length } });
  } catch (error) {
    next(error);
  }
};

// Obtener orden por ID
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name price images");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Orden no encontrada." });

    // Solo admin o el dueño de la orden pueden verla
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "No autorizado." });
    }

    res.json({ success: true, data: { order } });
  } catch (error) {
    next(error);
  }
};

//Actualizar estado de orden
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Orden no encontrada." });
    res.json({
      success: true,
      message: "Estado de orden actualizado.",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};

//Cancelar orden
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Orden no encontrada." });

    // Solo el dueño o admin pueden cancelar
    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "No autorizado." });
    }

    if (["delivered", "cancelled"].includes(order.status)) {
      return res
        .status(400)
        .json({ success: false, message: "No se puede cancelar esta orden." });
    }

    // Restaurar stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Orden cancelada correctamente.",
      data: { order },
    });
  } catch (error) {
    next(error);
  }
};
