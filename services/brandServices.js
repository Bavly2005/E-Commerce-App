import sharp from "sharp";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import Brand from "../models/brandModel.js";
import * as factory from "./handlersFactory.js";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";

// Upload single image
export const uploadBrandImage = uploadSingleImage("image");

// Image processing
export const resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${fileName}`);

  // Save image into DB
  req.body.image = fileName;

  next();
});

// @desc    Get list of brands
// @route   GET  /api/v1/brands
// @access  Public
export const getBrands = factory.getAll(Brand);

// @desc    Get specific Brand by id
// @route   GET   /api/v1/brands/:id
// @access  Public
export const getBrand = factory.getOne(Brand);

// @desc    Create Brand
// @route   POST  /api/v1/brands
// @access  Private/Admin-Manager
export const createBrand = factory.createOne(Brand);

// @desc    Update specific Brand
// @route   POST  /api/v1/brands/:id
// @access  Private/Admin-Manager
export const updateBrand = factory.updateOne(Brand);

// @desc     Delete specific Brand
// @route    DELETE  /api/v1/brands/:id
// @access   Private/Admin
export const deleteBrand = factory.deleteOne(Brand);
