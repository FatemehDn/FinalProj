import express = require("express");
import { Controller } from "../controller/teacherMarksController";
import { MIsPosInt } from "../../middleware/isPositiveInt";
import { MValidUser } from "../../middleware/MValidateUserData";
import { authUser } from "../../middleware/checkToken";
import { MValidTeacherMark } from "../../middleware/MvalidTeacherMark";

const tMarksController = new Controller();
export const teacherMarksRoute = express.Router();

teacherMarksRoute.put(
  "/",
  MValidTeacherMark,
  authUser,
  tMarksController.addTeacherMark
);
