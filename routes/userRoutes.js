import { Router } from "express";

import * as authServices from "../services/authServices.js";

import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  resizeImage,
  uploadUserImage,
  changeUserPaassword,
  getLoggedUserData,
  updateLoggenUserPassword,
  updateLoggenUserData,
  deleteLoggedUser,
} from "../services/userServices.js";
import {
  createUserValidator,
  updateUserValidatior,
  getUserValidatior,
  deleteUserValidatior,
  changeUserPasswordValidator,
  updateLoggedUserValidatior,
} from "../utils/validatiors/userValidator.js";

const router = Router();

router.use(authServices.protect);

router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", updateLoggenUserPassword);
router.put("/updateMe", updateLoggedUserValidatior, updateLoggenUserData);
router.delete("/deleteMe", deleteLoggedUser);

router.use(authServices.allowedTo("admin", "manager"));

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPaassword,
);

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidatior, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidatior, updateUser)
  .delete(deleteUserValidatior, deleteUser);

export default router;
