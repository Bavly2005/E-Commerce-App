import { Router } from "express";

import * as authServices from "../services/authServices.js";

import {
  addProductToCart,
  clearLoggedUserCart,
  getLoggedUserCart,
  updateCartItemQuantity,
  removeSpecificCartItem,
  applyCoupon,
} from "../services/cartServices.js";

const router = Router();

router.use(authServices.protect, authServices.allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearLoggedUserCart);

router.put("/applyCoupon", applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

// router.delete("/:addressId");

export default router;
