import express = require("express");
import { EnrollmentController } from "../controller/controller";
import { MIsPosInt } from "../../middleware/isPositiveInt";
import { MValidUser } from "../../middleware/MValidateUserData";
import { authUser } from "../../middleware/checkToken";
import { checkRole } from "../../middleware/checkRole";
import { MValidEnrollmentInput } from "../../middleware/MValidEnrollmentInput";
import { MValidSetMark } from "../../middleware/MvalidSetMarkInput";

const controller = new EnrollmentController();
export const enrollRoute = express.Router();

enrollRoute.get(
  "/",
  authUser,
  checkRole(["admin", "teacher"]),
  controller.getAll
);
enrollRoute.get(
  "/:id",
  MIsPosInt,
  authUser,
  controller.getEnrollsByUserId
);
enrollRoute.post(
  "/",
  MValidEnrollmentInput,
  authUser,
  controller.addEnroll
);

enrollRoute.put(
  "/setMark",
  MValidSetMark,
  authUser,
  checkRole(["teacher","admin"]),
  controller.setMark
);


enrollRoute.get(
  "/getTeacherActiveUsers/:Id",
  MIsPosInt,
  authUser,
  checkRole(["teacher","admin"]),
  controller.getActiveUsersOfTeacher
);


