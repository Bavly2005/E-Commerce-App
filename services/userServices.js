import sharp from "sharp";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

import ApiError from "../utils/apiError.js";
import User from "../models/userModel.js";
import * as factory from "./handlersFactory.js";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";
import createToken from "../utils/createToken.js";

// Upload single image
export const uploadUserImage = uploadSingleImage("profileImg");

// Image processing
export const resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${fileName}`);

    // Save image into DB
    req.body.image = fileName;
  }

  next();
});

// @desc    Get list of users
// @route   GET  /api/v1/users
// @access  Private/Admin
export const getUsers = factory.getAll(User);

// @desc    Get specific User by id
// @route   GET   /api/v1/users/:id
// @access  Private/Admin
export const getUser = factory.getOne(User);

// @desc    Create User
// @route   POST  /api/v1/users
// @access  Private/Admin
export const createUser = factory.createOne(User);

// @desc    Update specific User
// @route   POST  /api/v1/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    },
  );

  if (!document) {
    return next(new ApiError(`No document for this id: ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

export const changeUserPaassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );

  if (!document) {
    return next(new ApiError(`No document for this id: ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

// @desc     Delete specific User
// @route    DELETE  /api/v1/users/:id
// @access   Private/Admin
export const deleteUser = factory.deleteOne(User);

// @desc    Get logged user data
// @route   GET   /api/v1/users/getMe
// @access  Private/Protect
export const getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params = req.user._id;
  next();
});

// @desc    Update logged user password
// @route   PUT   /api/v1/users/changeMyPassword
// @access  Private/Protect
export const updateLoggenUserPassword = asyncHandler(async (req, res, next) => {
  // 1) Update user password based user payload
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    },
  );

  // 2) Generate token
  const token = createToken(user._id);
  res.status(200).json({ data: user, token });
});

// @desc    Update logged user data (without passwordd , role)
// @route   PUT   /api/v1/users/updateMe
// @access  Private/Protect
export const updateLoggenUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true },
  );

  res.status(200).json({ data: updatedUser });
});

// @desc    Deactivate logged user
// @route   DELETE   /api/v1/users/deleteMe
// @access  Private/Protect
export const deleteLoggedUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: "Success" });
});
