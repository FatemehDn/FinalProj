import { validSetMarkInput } from "../validation/validation";
import { Request, Response, NextFunction } from "express";

export const MValidSetMark = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const list = validSetMarkInput(req.body);

  if (list.error) {
    res.status(400).send({ Error: list.error?.message });
    return;
  }
  next();
};
