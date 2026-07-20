import { Router } from "express";

import * as authServices from "../services/authServices.js";

import {
  createReview,
  deleteReview,
  getReviews,
  getReview,
  updateReview,
  createFileObject,
  setProductIdAndUserIdToBody,
} from "../services/reviewServices.js";
import {
  createReviewValidator,
  updateReviewValidatior,
  getReviewValidatior,
  deleteReviewValidatior,
} from "../utils/validatiors/reviewValidator.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(createFileObject, getReviews)
  .post(
    authServices.protect,
    authServices.allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview,
  );

router
  .route("/:id")
  .get(getReviewValidatior, getReview)
  .put(
    authServices.protect,
    authServices.allowedTo("user"),
    updateReviewValidatior,
    updateReview,
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin", "manager", "user"),
    deleteReviewValidatior,
    deleteReview,
  );

export default router;
