import { Schema, model } from "mongoose";

const cartSchema = new Schema(
  {
    cartItems: [
      {
        product: {
          type: Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
        color: String,
      },
    ],

    totalCartPrice: Number,

    totalPriceAfterDiscount: Number,

    user: {
      type: Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default model("Cart", cartSchema);
