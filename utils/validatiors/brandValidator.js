import { body, check } from "express-validator";
import slugify from "slugify";
import validatorMiddleware from "../../middlewares/validatiorMiddleware.js";

export const getBrandValidatior = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];

export const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand required")
    .isLength({ min: 3 })
    .withMessage("Too short brand name")
    .isLength({ max: 32 })
    .withMessage("Too long brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

export const updateBrandValidatior = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

export const deleteBrandValidatior = [
  check("id").isMongoId().withMessage("Invalid brand id format"),
  validatorMiddleware,
];
