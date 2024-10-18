import { Request, Response, NextFunction } from "express";
import { validateRoomInput } from "../validation/validation";

export const MValidRoomInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const list = validateRoomInput(req.body);
  if (list.error) {
    res.status(404).send({ Error: list.error?.message });
    return;
  }
  next();
};
