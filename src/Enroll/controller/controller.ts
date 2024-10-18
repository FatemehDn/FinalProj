import { Request, Response, NextFunction } from "express";
import { EnrollmentRepo } from "../repository/enrollmentRepo";
import { findUserWithToken } from "../../utils/findUserWithToken";
const repo = new EnrollmentRepo();

export class EnrollmentController {
  constructor() {}

  public getAll = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No enroll found." });
      return;
    }
    const users = await repo.getData();
    res.json(users);
  };

  public getEnrollsByUserId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No enroll found." });
      return;
    }
    const id = parseInt(req.params.id);
    const find = await repo.getEnrollsByUserId(id);

    if (find == null) {
      res.status(404).send({ message: "not enroll found." });
      return;
    }
    res.status(200).send(find);
  };

  public addEnroll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { subjectId } = req.body;
      const token = req.headers["authorization"];

      const result = await repo.addEnrollmentById(subjectId, token);
      res.status(201).send(result);
    } catch {
      res.status(500);
    }
  };
  public setMark = async (req: Request, res: Response): Promise<void> => {
    const { userId, subjectId, mark } = req.body;
    const user = await findUserWithToken(req, res);
    const result = await repo.setMark(userId, subjectId, mark, user);
    if (!result.flag) {
      res
        .status(401)
        .send(result.message);
      return;
    }
    res.status(201).send(result.message);
  };

  public getActiveUsersOfTeacher = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const teacherId = parseInt(req.params.Id);
    console.log(teacherId);
    const result = await repo.getActiveUsersOfTeacher(teacherId);
    res.status(201).send(result);
  };
}
