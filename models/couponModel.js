import { Schema, model } from "mongoose";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Coupon name required"],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire time required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount value is required"],
    },
  },
  { timestamps: true },
);

const Coupon = model("Coupon", couponSchema);
export default Coupon;
