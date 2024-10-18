import { Request, Response, NextFunction } from "express";
import { isPositiveInt } from "../validation/validation";

export const MIsPosInt = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = isPositiveInt(req.params.id);
  if (id.error) {
    res.status(401).send({ Error: id.error?.message });
    return;
  }
  next();
};
