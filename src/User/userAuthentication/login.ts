require("dotenv").config();
import { userRepo } from "../repository/userRepo";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../model/IUser";

const repo = new userRepo();

export const login = async (req: Request, res: Response) => {
  const user = (await repo.findeByName(req.body.name)) as unknown as IUser;
  // console.log(user);
  // console.log(user.password);
  if (user == null) {

    return res.send({ message: "user not found." });
  }
  const passIsValid = await bcrypt.compare(req.body.password, user.password);

  try {
    if (!passIsValid) {
     return res.send({ message: "password is wrong." });
    }
    const data = {
      name: req.body.name,
    };

    const accessToken = jwt.sign(
      data,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    console.log({ accessToken: accessToken });
  
    return res.send({ message: " you logged in.", accessToken  });
  } catch(error) {
    
    res.status(500).send(error);
  }
};

export interface JwtPayload {
  name: string;
}
export const verifyToken =(token:string)=>{
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload
}
