import { check } from "express-validator";
import validatorMiddleware from "../../middlewares/validatiorMiddleware.js";
import Review from "../../models/reviewModel.js";

export const getReviewValidatior = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

export const createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("ratings value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating values must be between 1 to 5"),
  check("user").isMongoId().withMessage("Invalid user id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product id format")
    .custom((val, { req }) =>
      // Check if logged user create review before
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before"),
            );
          }
        },
      ),
    ),
  validatorMiddleware,
];

export const updateReviewValidatior = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      // Check review ownership before update
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to perform thsi action"),
          );
        }
      }),
    ),
  validatorMiddleware,
];

export const deleteReviewValidatior = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        // Check review ownership before update
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(
              new Error(`There is no review with id ${val}`),
            );
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to perform thsi action"),
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
