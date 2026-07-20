import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";

// @desc    Add product to wishlist
// @route   POST  /api/v1/wishlist
// @access  Protected/User
export const addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true },
  );

  res.status(200).json({
    status: "Success",
    message: "Product add successfully to your wishlist",
    data: user.wishlist,
  });
});

// @desc    remove product from wishlist
// @route   DELETE  /api/v1/wishlist/:productId
// @access  Protected/User
export const removeProductFromWishlist = asyncHandler(
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { wishlist: req.params.productId },
      },
      { new: true },
    );

    res.status(200).json({
      status: "Success",
      message: "Product removed successfully from your wishlist",
      data: user.wishlist,
    });
  },
);

// @desc    Get logged user wishlist
// @route   GET  /api/v1/wishlist
// @access  Protected/User
export const getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "success",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
