import { Request, Response, NextFunction } from "express";
import models from "../dataBase/models/index";

export const idCouldBeTeacher = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId, subjectId } = req.body;

  const enrollment = await models.Enrollment.findOne({
    where: { userId, subjectId },
  });

  if (!enrollment) {
    res.status(403).send({
      message: "User is not registered for this course.",
    });
    return;
  }

  if (enrollment.mark == null) {
    res.status(403).send({
      message: "user is still active in this sub so he cant become teacher.",
    });
    return;
  }
  next();
};
