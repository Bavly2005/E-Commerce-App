import mongoose, { Schema, Types, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
    },

    profileImg: { type: String },

    password: {
      type: String,
      required: [true, "password required"],
      minlength: [6, "Too short password"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,

    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },

    active: {
      type: Boolean,
      default: true,
    },

    wishlist: [
      {
        type: Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postlCode: Number,
      },
    ],
  },
  { timestamp: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  // Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
});

const User = model("User", userSchema);

export default User;
