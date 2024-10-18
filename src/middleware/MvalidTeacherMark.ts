import { validTeacherMark } from "../validation/validation";
import { Request, Response, NextFunction } from "express";

export const MValidTeacherMark = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const list = validTeacherMark(req.body);
  
    if (list.error) {
      res.status(400).send({ Error: list.error?.message }); 
      return;
    }
    next();
  };