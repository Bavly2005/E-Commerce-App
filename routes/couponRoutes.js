import { Router } from "express";

import * as authServices from "../services/authServices.js";

import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
} from "../services/couponServices.js";

const router = Router();

router.use(authServices.protect, authServices.allowedTo("admin", "manager"));

router.route("/").get(getCoupons).post(createCoupon);

router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

export default router;
