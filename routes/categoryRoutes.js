import { Router } from "express";
import subCategoryRoute from "./subCategoryRoutes.js";

import * as authServices from "../services/authServices.js";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  resizeImage,
  updateCategory,
  uploadCategoryImage,
} from "../services/categoryServices.js";
import {
  createCategoryValidator,
  deleteCategoryValidatior,
  getCategoryValidatior,
  updateCategoryValidatior,
} from "../utils/validatiors/categoryValidator.js";

const router = Router();

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory,
  );

router
  .route("/:id")
  .get(getCategoryValidatior, getCategory)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidatior,
    updateCategory,
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteCategoryValidatior,
    deleteCategory,
  );

export default router;
