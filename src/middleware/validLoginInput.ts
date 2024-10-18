import { Request, Response, NextFunction } from "express";
import { validateLogin } from "../validation/validation";

export const MValidLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const list = validateLogin(req.body);
  if (list.error) {
    res.status(404).send({ Error: list.error?.message });
    return;
  }
  next();
};
