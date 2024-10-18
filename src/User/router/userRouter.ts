import express = require("express");
import { UserController } from "../controller/userController";
import { login } from "../userAuthentication/login";
import { MIsPosInt } from "../../middleware/isPositiveInt";
import { MValidUser } from "../../middleware/MValidateUserData";
import { MValidLoginInput } from "../../middleware/validLoginInput";
import { authUser } from "../../middleware/checkToken";
import { checkRole } from "../../middleware/checkRole";
import { validUserToUpdate } from "../../middleware/validUserToUpdate";
import { validToUpdateRole } from "../../middleware/validToUpdateRole";
import { MValidSetTeacher } from "../../middleware/MvalidSetTeacherInput";
import { idCouldBeTeacher } from "../../middleware/idCouldBeTeacher";
import { MValidUpdateUser } from "../../middleware/MvalidUpdateUserInput";

const userController = new UserController();
export const userRoute = express.Router();

userRoute.post("/login", MValidLoginInput, login);
userRoute.get(
  "/",
  authUser,
  checkRole(["admin", "teacher"]),
  userController.getAllUsers
);
userRoute.get(
  "/:id",
  MIsPosInt,
  authUser,
  checkRole(["admin", "teacher"]),
  userController.getUserById
);
userRoute.post(
  "/",
  MValidUser,
  authUser,
  checkRole(["admin"]),
  userController.addUser
);
userRoute.put(
  "/update",
  MIsPosInt,
  authUser,
  MValidUpdateUser,
  validUserToUpdate,
  userController.updateUser
);
userRoute.delete(
  "/:id",
  MIsPosInt,
  authUser,
  checkRole(["admin"]),
  userController.deleteUser
);

userRoute.put(
  "/setTeacher",
  MValidSetTeacher,
  idCouldBeTeacher,
  authUser,
  checkRole(["admin"]),
  userController.setTeacher
);


