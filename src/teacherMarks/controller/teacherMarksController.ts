import { Request, Response, NextFunction } from "express";
import { teacherMarksRepo } from "../repository/teacherMarksRepo";
import { findUserWithToken } from "../../utils/findUserWithToken";
import bcrypt from "bcrypt";
const repo = new teacherMarksRepo();

export class Controller {
  constructor() {}
  public addTeacherMark =async (req: Request, res: Response): Promise<void> => {
    try {
      const { enrollmentId, mark } = req.body;

      const user = await findUserWithToken(req, res);
      if (!user){
        res.status(403).send({ message: "user doesnt exists." });
        return; } 
    
      const isOwnedByUser = await repo.isEnrollmentOwnedByUser(parseInt(enrollmentId), user.id);
      if (!isOwnedByUser) {
        res.status(403).send({ message: "this enrollment is not yours." });
        return;
      }

      const result = await repo.addTeacherMark(parseInt(enrollmentId), parseInt(mark));
      if (!result.flag) {
        res.status(400).send({ message: result.message });
      } else {
        res.status(201).send({ message: result.message });
      }
    } catch (error) {
      console.error("Error adding teacher mark:", error);}
  };

  }
