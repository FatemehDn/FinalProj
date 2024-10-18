import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userRepo } from "../User/repository/userRepo";
import { IUser } from "../User/model/IUser";

const repo = new userRepo();

interface JwtType {
  name: string;
}

export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers["authorization"];
  if (token == null) {
    res.status(401).send({ message: "token not provided in authorization." });
    return;
  }
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtType;

    const user = (await repo.findeByName(decoded.name)) as unknown as IUser;
    //   console.log(user.role);

    if (user == null) {
      res.status(403).send({
        message: "you have token but its not valid. you dont have access.",
      });
      return;
    }

    next();
  } catch (error) {
   
    res.status(403).send({
      message: "Invalid token or token expired. Please login again.",
    });
  }
};
