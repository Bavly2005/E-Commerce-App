import { Router } from "express";
import reviewsRoute from "./reviewRoutes.js";
import * as authServices from "../services/authServices.js";

import {
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct,
  uploadProductImages,
  resizeProductImages,
} from "../services/productServices.js";
import {
  createProductValidator,
  deleteProductValidator,
  getProductValidator,
  updateProductValidator,
} from "../utils/validatiors/productValidator.js";

const router = Router();

router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct,
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct,
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct,
  );

export default router;
