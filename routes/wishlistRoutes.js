import { Router } from "express";

import * as authServices from "../services/authServices.js";

import {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} from "../services/wishlistServices.js";

const router = Router();

router.use(authServices.protect, authServices.allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete("/:productId", removeProductFromWishlist);

export default router;
