import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { userRepo } from "../User/repository/userRepo";
import { IUser } from "../User/model/IUser";

const repo = new userRepo();

interface JwtType {
  name: string;
}

export const findUserWithToken = async (req: Request, res: Response): Promise<IUser | null> => {
    const token = req.headers["authorization"]
    if (!token) {
      res.status(401).send({ message: "Access token is missing or invalid." });
      return null;
    }
  
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtType;
      const user = (await repo.findeByName(decoded.name)) as IUser;
  
      if (!user) {
        res.status(404).send({ message: "User not found" });
        return null;
      }
  
      return user;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  };
