import express = require("express");
import { RoomController } from "../controller/roomController";
import { MIsPosInt } from "../../middleware/isPositiveInt";
import { MValidUser } from "../../middleware/MValidateUserData";
import { authUser } from "../../middleware/checkToken";
import { checkRole } from "../../middleware/checkRole";
import { MValidRoomInput } from "../../middleware/MValidRoom";
import { MIsRoomNumDiffrent } from "../../middleware/MDiffrentRoomNum";

const roomController = new RoomController();
export const roomRoute = express.Router();

roomRoute.get("/",checkRole(["admin","teacher"]) , roomController.getAllRooms);
roomRoute.get("/:id", MIsPosInt, checkRole(["admin","teacher"]), roomController.getRoomById);
roomRoute.post("/",MValidRoomInput ,checkRole(["admin"]), roomController.addRoom);
roomRoute.put("/:id", MIsPosInt, MValidRoomInput, checkRole(["admin"]), roomController.updateRoom);
roomRoute.delete("/:id", MIsPosInt, checkRole(["admin"]) , roomController.deleteRoom);
