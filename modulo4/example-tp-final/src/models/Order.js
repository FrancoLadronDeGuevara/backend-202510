import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "La cantidad mínima es 1"],
  },
  priceAtPurchase: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es obligatorio"],
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "La orden debe tener al menos un producto",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: "Argentina" },
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "cash", "transfer"],
      default: "cash",
    },
    notes: {
      type: String,
      maxlength: [500, "Las notas no pueden superar los 500 caracteres"],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
