import Coupon from "../models/couponModel.js";
import * as factory from "./handlersFactory.js";

// @desc    Get list of coupons
// @route   GET  /api/v1/coupons
// @access  Private/Admin-Manager
export const getCoupons = factory.getAll(Coupon);

// @desc    Get specific Coupon by id
// @route   GET   /api/v1/coupons/:id
// @access  Private/Admin-Manager
export const getCoupon = factory.getOne(Coupon);

// @desc    Create Coupon
// @route   POST  /api/v1/coupons
// @access  Private/Admin-Manager
export const createCoupon = factory.createOne(Coupon);

// @desc    Update specific coupons
// @route   POST  /api/v1/coupons/:id
// @access  Private/Admin-Manager
export const updateCoupon = factory.updateOne(Coupon);

// @desc     Delete specific coupons
// @route    DELETE  /api/v1/coupons/:id
// @access   Private/Admin-Manager
export const deleteCoupon = factory.deleteOne(Coupon);
