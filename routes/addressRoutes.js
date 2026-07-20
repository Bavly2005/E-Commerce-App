import { Router } from "express";

import * as authServices from "../services/authServices.js";

import {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} from "../services/addressServices.js";

const router = Router();

router.use(authServices.protect, authServices.allowedTo("user"));

router.route("/").post(addAddress).get(getLoggedUserAddresses);

router.delete("/:addressId", removeAddress);

export default router;
