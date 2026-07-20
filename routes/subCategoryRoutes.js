import { Router } from "express";

import * as authServices from "../services/authServices.js";

import {
  createFileObject,
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategory,
  setCategoryIdToBody,
  updateSubCategory,
} from "../services/subCategoryServices.js";
import {
  createSubCategoryValidator,
  deleteSubCategoryValidatior,
  getSubCategoryValidatior,
  updateSubCategoryValidatior,
} from "../utils/validatiors/subCategoryValidatior.js";

//  mergeParams: Allow us to access parametares on other routes
const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory,
  )
  .get(createFileObject, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidatior, getSubCategory)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    updateSubCategoryValidatior,
    updateSubCategory,
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteSubCategoryValidatior,
    deleteSubCategory,
  );

export default router;
