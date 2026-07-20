import sharp from "sharp";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import Category from "../models/categoryModel.js";
import * as factory from "./handlersFactory.js";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";

// Upload single image
export const uploadCategoryImage = uploadSingleImage("image");

// Image processing
export const resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${fileName}`);

    // Save image into DB
    req.body.image = fileName;
  }

  next();
});

// @desc    Get list of categories
// @route   GET  /api/v1/categories
// @access  Public
export const getCategories = factory.getAll(Category);

// @desc    Get specific category by id
// @route   GET   /api/v1/categories/:id
// @access  Public
export const getCategory = factory.getOne(Category);

// @desc    Create Category
// @route   POST  /api/v1/categories
// @access  Private/Admin-Manager
export const createCategory = factory.createOne(Category);

// @desc    Update specific category
// @route   POST  /api/v1/categories/:id
// @access  Private/Admin-Manager
export const updateCategory = factory.updateOne(Category);
// @desc     Delete specific category
// @route    DELETE  /api/v1/categories/:id
// @access   Private/Admin
export const deleteCategory = factory.deleteOne(Category);
