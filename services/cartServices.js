/* eslint-disable import/prefer-default-export */
import asyncHandler from "express-async-handler";

import ApiError from "../utils/apiError.js";

import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Coupon from "../models/couponModel.js";

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 1;
    totalPrice += price * quantity;
  });
  // console.log("القيم اللي بتتحسب:", cart.cartItems);
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desk Add product to cart
// @route POST /api/v1/cart
// @access Private/User
export const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId);
  // 1) Get cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color: color, price: product.price }],
    });
  } else {
    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color,
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart item ,push product to cartItems array
      cart.cartItems.push({
        product: productId,
        color: color,
        price: product.price,
      });
    }
  }

  // Calculate total cart price
  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    message: "Product added to cart successfully",
    data: cart,
  });
});

// @desk Get logged user cart
// @route GET /api/v1/cart
// @access Private/User
export const getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id: ${req.user._id}`, 404),
    );
  }

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desk Remove specific cart item
// @route DELETE /api/v1/cart/:itemId
// @access Private/User
export const removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true },
  );

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(203).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desk Clear logged user cart
// @route DELETE /api/v1/cart/
// @access Private/User
export const clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desk Update specific cart item quantity
// @route PUT /api/v1/cart/:itemId
// @access Private/User
export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user: ${req.user._id}`),
    );
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId,
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`There is no itme for this id: ${req.params.itemId}`),
    );
  }

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(203).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desk Apply coupon on logged user cart
// @route PUT /api/v1/cart/applyCoupon
// @access Private/User
export const applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError("Coupon is invalid or expired"));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });
  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after discount
  const totalPriceAfterDiscount = (
    totalPrice
    - (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(203).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
