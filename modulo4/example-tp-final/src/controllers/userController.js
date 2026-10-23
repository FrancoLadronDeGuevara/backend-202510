import User from "../models/User.js";

//Obtener todos los usuarios
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(Number(limit)).sort("-createdAt"),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        users,
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

//Obtener usuario por ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado." });
    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

//Actualizar usuario
export const updateUser = async (req, res, next) => {
  try {
    // Solo admin puede actualizar otros usuarios
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== req.params.id
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "No autorizado para editar este usuario.",
        });
    }

    const allowedFields = ["name", "email", "avatar"];
    // Solo admin puede cambiar roles
    if (req.user.role === "admin") allowedFields.push("role", "isActive");

    const updates = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    // Manejar cambio de contraseña por separado
    if (req.body.password) {
      const user = await User.findById(req.params.id).select("+password");
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "Usuario no encontrado." });
      user.password = req.body.password;
      Object.assign(user, updates);
      await user.save();
      return res.json({
        success: true,
        message: "Usuario actualizado.",
        data: { user },
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado." });

    res.json({
      success: true,
      message: "Usuario actualizado.",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

//Eliminar usuario
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado." });
    res.json({ success: true, message: "Usuario desactivado correctamente." });
  } catch (error) {
    next(error);
  }
};
