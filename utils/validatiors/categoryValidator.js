import { body, check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatiorMiddleware.js";

export const getCategoryValidatior = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

export const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const updateCategoryValidatior = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

export const deleteCategoryValidatior = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
