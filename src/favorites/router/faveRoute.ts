import express = require("express");
import { favoritesController } from "../controller/faveController";
import { MIsPosInt } from "../../middleware/isPositiveInt";
import { MValidEnrollmentInput } from "../../middleware/MValidEnrollmentInput";
import { authUser } from "../../middleware/checkToken";
import { checkRole } from "../../middleware/checkRole";


const controller = new favoritesController
export const favoriteRoute = express.Router();

favoriteRoute.get(
  "/:id",
  MIsPosInt,
  authUser,
  controller.getFavesById
);
favoriteRoute.post(
  "/",
  MValidEnrollmentInput,
  authUser,
  controller.addNewFave
);

favoriteRoute.delete(
  "/",
  MValidEnrollmentInput,
  authUser,
  controller.deleteFave
);
