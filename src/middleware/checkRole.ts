import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userRepo } from "../User/repository/userRepo";
import { IUser } from "../User/model/IUser";

const repo = new userRepo();

interface JwtType {
  name: string;
}

export const checkRole = (permission: any) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const token = req.headers["authorization"];
    console.log(token);
    if (!token) {
      res.status(401).send({ message: "Access token is missing or invalid." });
      return;
    }
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtType;

    const user = (await repo.findeByName(decoded.name)) as unknown as IUser;
    // console.log(user.role);

    if (!permission.includes(user.role)) {
      res.status(401).json({ message: "you dont have permission!" });
      return;
    }

    next();
  };
};
