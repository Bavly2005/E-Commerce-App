import { Router } from "express";

import * as authServices from "../services/authServices.js";

import {
  createCashOrder,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder,
  updateOrderToDelivered,
  updateOrderToPaid,
  checkoutSession,
} from "../services/orderServices.js";

const router = Router();

router.use(authServices.protect);

router.get(
  "checkout-session/:cartId",
  authServices.allowedTo("user"),
  checkoutSession,
);

router.route("/cartId").post(authServices.allowedTo("user"), createCashOrder);
router.get(
  "/",
  authServices.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  findAllOrders,
);
router.get("/:id", findSpecificOrder);

router.put(
  "/:id/pay",
  authServices.allowedTo("admin", "manager"),
  updateOrderToPaid,
);
router.put(
  "/:id/deliver",
  authServices.allowedTo("admin", "manager"),
  updateOrderToDelivered,
);

export default router;
