import SubCategory from "../models/subCategoryModel.js";
import * as factory from "./handlersFactory.js";

// Middleware
export const setCategoryIdToBody = (req, res, next) => {
  //   Nested Route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

export const createFileObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};

// @desc    Create SubCategory
// @route   POST  /api/v1/subcategories
// @access  Private/Admin-Manager
export const createSubCategory = factory.createOne(SubCategory);

// @desc    Get list of SubCategories
// @route   GET  /api/v1/subcategories
// @access  Public
export const getSubCategories = factory.getAll(SubCategory);

// @desc    Get specific SubCategory by id
// @route   GET   /api/v1/subcategories/:id
// @access  Public
export const getSubCategory = factory.getOne(SubCategory);

// @desc    Update specific SubCategory
// @route   POST  /api/v1/subcategories/:id
// @access  Private/Admin-Manager
export const updateSubCategory = factory.updateOne(SubCategory);

// @desc     Delete specific SubCategory
// @route    DELETE  /api/v1/subcategories/:id
// @access   Private/Admin
export const deleteSubCategory = factory.deleteOne(SubCategory);
