import { body, check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatiorMiddleware.js";

export const getSubCategoryValidatior = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  validatorMiddleware,
];

export const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category required")
    .isLength({ min: 2 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("SubCategory must be belong to Category")
    .isMongoId()
    .withMessage("Invalid Category id format"),
  validatorMiddleware,
];

export const updateSubCategoryValidatior = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

export const deleteSubCategoryValidatior = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  validatorMiddleware,
];
