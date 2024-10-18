import express = require("express");
import { SubjectController } from "../controller/subjectController";
import { MIsPosInt } from "../../middleware/isPositiveInt";
import { MValidUser } from "../../middleware/MValidateUserData";
import { authUser } from "../../middleware/checkToken";
import { checkRole } from "../../middleware/checkRole";
import { MValidSub } from "../../middleware/MValidateSubjectInput";
import { MValidRegisterForRoom } from "../../middleware/MvalidRegisterForRoom";

const controller = new SubjectController();
export const subjectRoute = express.Router();

subjectRoute.get("/", authUser, controller.getAllSub);
subjectRoute.get(
  "/:id",
  MIsPosInt,
  authUser,
  checkRole(["admin", "teacher"]),
  controller.getSubById
);
subjectRoute.post(
  "/",
  MValidSub,
  authUser,
  checkRole(["admin"]),
  controller.addSub
);
subjectRoute.put(
  "/updateSub/:id",
  MIsPosInt,
  MValidSub,
  authUser,
  checkRole(["admin"]),
  controller.updateSub
);
subjectRoute.delete(
  "/:id",
  MIsPosInt,
  authUser,
  checkRole(["admin"]),
  controller.deleteSub
);

subjectRoute.get(
  "/teacherSubs/:id",
  MIsPosInt,
  authUser,
  controller.teacherSubs
);

subjectRoute.put(
  "/registerSubForRoom",
  MValidRegisterForRoom,
  authUser,
  checkRole(["admin"]),
  controller.registerForRoom
);


