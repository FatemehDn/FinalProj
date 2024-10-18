import { Request, Response, NextFunction } from "express";
import { findUserWithToken } from "../utils/findUserWithToken";
import { IUser } from "../User/model/IUser";
import { BasicRepo } from "../basicRepo/basicRepository";

export const validToUpdateRole = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user: IUser | null = await findUserWithToken(req, res);
  if (!user) return;

  if (user.role != "admin") {
    if (user.role != req.body.role) {
      res.status(401).json({
        message: "only admin can change role, enter your current role to continue.",
      });
      return;
    }
    if(req.body.role == "teacher"){
        res.status(401).json({
            message: "you cant set teacher from here.",
          });
          return;
    }
  }

  next();
};
