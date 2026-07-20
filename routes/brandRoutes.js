import { Router } from "express";

import * as authServices from "../services/authServices.js";

import {
  createBrand,
  deleteBrand,
  getBrands,
  getBrand,
  updateBrand,
  resizeImage,
  uploadBrandImage,
} from "../services/brandServices.js";
import {
  createBrandValidator,
  deleteBrandValidatior,
  getBrandValidatior,
  updateBrandValidatior,
} from "../utils/validatiors/brandValidator.js";

const router = Router();

router
  .route("/")
  .get(getBrands)
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand,
  );

router
  .route("/:id")
  .get(getBrandValidatior, getBrand)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidatior,
    updateBrand,
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteBrandValidatior,
    deleteBrand,
  );

export default router;
