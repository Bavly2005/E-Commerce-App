/* eslint-disable import/prefer-default-export */
import crypto from "crypto";

import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import ApiError from "../utils/apiError.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import createToken from "../utils/createToken.js";
import { sanitizeUser } from "../utils/sanitizeData.js";

// @desk Signup
// @route POST /api/v1/auth/signup
// @access Public
export const signup = asyncHandler(async (req, res, next) => {
  // 1-Create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // 2-Generate Token
  const token = createToken(user._id);

  res.status(201).json({ data: user, token });
});

// @desc Login
// @route POST /api/v1/auth/login
// @access Public
export const login = asyncHandler(async (req, res, next) => {
  // 1) check if password and email in the body (validation)
  // 2) check if user exist & if password is correct
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new Error("Invalid email or password", 401));
  }
  // 3) generate token
  const token = createToken(user._id);
  // 4) send response to client side
  res.status(200).json({ data: sanitizeUser(user), token });
});

// @desc Make sure the user is logged in
export const protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist , if exist get
  let token;
  if (
    req.headers.authorization
    && req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError("You are not login, Please login to access this route", 401),
    );
  }
  // 2) Verify token (no changes happen, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401,
      ),
    );
  }
  // 4) Check if user changes his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password, please login again..",
          401,
        ),
      );
    }
  }

  req.user = currentUser;
  next();
});

// @desc Authorization
export const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403),
      );
    }
    next();
  });

// @desc Forget password
// @route POST /api/v1/auth/forgetPassword
// @access Public
export const forgetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new Error(`There is no user with this email ${req.body.email}`, 404),
    );
  }
  // 2) If user exist, Generate hasg reset random 6 digits and save it in DB
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed reset code in DB
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  user.passwordResetVerified = false;

  await user.save();

  const message = `Hi ${user.name},
   \n We received a request to reset the password on your E-shop account 
   \n ${resetCode} 
   \n Enter this code to complete the reset`;
  // 3) Send the reset code via email
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code valid in 10 min",
      message,
    });
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

// @desc Verify reset code password
// @route POST /api/v1/auth/verifyResetCode
// @access Public
export const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code is invalid or expired"));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: "Success" });
});

// @desc Reset password
// @route PUT /api/v1/auth/resetPassword
// @access Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404),
    );
  }

  // 2) Check if reset code is verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
