import Review from "../models/reviewModel.js";
import * as factory from "./handlersFactory.js";

// Middleware
export const setProductIdAndUserIdToBody = (req, res, next) => {
  //   Nested Route
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

export const createFileObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObject = filterObject;
  next();
};

// @desc    Get list of Reviews
// @route   GET  /api/v1/reviews
// @access  Public
export const getReviews = factory.getAll(Review);

// @desc    Get specific Review by id
// @route   GET   /api/v1/reviews/:id
// @access  Public
export const getReview = factory.getOne(Review);

// @desc    Create Review
// @route   POST  /api/v1/reviews
// @access  Private/Protect/User
export const createReview = factory.createOne(Review);

// @desc    Update specific Review
// @route   POST  /api/v1/reviews/:id
// @access  Private/Protect/User
export const updateReview = factory.updateOne(Review);

// @desc     Delete specific Review
// @route    DELETE  /api/v1/reviews/:id
// @access   Private/Protect/User-Admin-Manager
export const deleteReview = factory.deleteOne(Review);
