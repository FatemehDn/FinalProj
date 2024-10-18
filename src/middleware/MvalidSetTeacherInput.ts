import { validSetTeacherInput } from "../validation/validation";
import { Request, Response, NextFunction } from "express";

export const MValidSetTeacher = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const list = validSetTeacherInput(req.body);

  if (list.error) {
    res.status(404).send({ Error: list.error?.message });
    return;
  }
  next();
};
