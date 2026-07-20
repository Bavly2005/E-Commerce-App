import { Router } from "express";

import {
  signup,
  login,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
} from "../services/authServices.js";
import {
  signupValidator,
  loginValidator,
} from "../utils/validatiors/authValidator.js";

const router = Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);

export default router;
