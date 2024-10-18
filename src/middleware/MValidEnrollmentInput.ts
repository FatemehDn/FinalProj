import { Request, Response, NextFunction } from "express";
import { validateEnrollmentInput } from "../validation/validation";

export const MValidEnrollmentInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const list = validateEnrollmentInput(req.body);
  if (list.error) {
    res.status(404).send({ Error: list.error?.message });
    return;
  }
  next();
};
