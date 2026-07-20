/* eslint-disable arrow-body-style */
import { body, check } from "express-validator";
import slugify from "slugify";
import Category from "../../models/categoryModel.js";
import SubCategory from "../../models/subCategoryModel.js";
import validatorMiddleware from "../../middlewares/validatiorMiddleware.js";

export const createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 char")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be numper")
    .isLength({ max: 32 })
    .withMessage("Too long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be number")
    .isFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("image")
    .optional()
    .isArray()
    .withMessage("Images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`),
          );
        }
      }),
    ),
  check("subcategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (results) => {
          if (
            results.length < 1
            || results.length !== subcategoriesIds.length
          ) {
            return Promise.reject(
              new Error(`No subcategory for this ids: ${subcategoriesIds}`),
            );
          }
        },
      ),
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subcategoriesIdsInDB = [];
          subcategories.forEach((subcategory) => {
            subcategoriesIdsInDB.push(subcategory._id.toString());
          });
          // check if subcategories ids in db include subcategories in req.body (true/false)
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (checker(val, subcategoriesIdsInDB)) {
            return Promise.reject(
              new Error("Subcategories do not belong to this category"),
            );
          }
        },
      ),
    ),
  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingAverage must be number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1,0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5,0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be number"),
  validatorMiddleware,
];

export const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

export const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
