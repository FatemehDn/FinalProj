import { Request, Response, NextFunction } from "express";
const models = require("../dataBase/models/index");

export const MIsRoomNumDiffrent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const roomNum = req.body.roomNumber;
  console.log(roomNum);
  const data = await models.Room.findOne({
    where: { room_number: roomNum } as any,
  });
  if (data != null) {
    res.status(401).json({ message: "this room number exits." });
    return;
  }
  next();
};
