import { Request, Response, NextFunction } from "express";
import { subjectRepo } from "../repository/subjectRepo";
import { promises } from "dns";

const repo = new subjectRepo();
export class SubjectController {
  constructor() {}

  public getAllSub = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No subject found." });
      return;
    }
    const users = await repo.showAllSubs();
    res.json(users);
  };

  public getSubById = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No subject found." });
      return;
    }
    const id = parseInt(req.params.id);
    const find = await repo.findById(id);

    if (find == null) {
      res.status(404).send({ message: "subject not found." });
      return;
    }
    res.status(200).send(find);
  };

  public addSub = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, roomId, capacity, unit } = req.body;

      repo.addUser(name, roomId, capacity, unit);
      res.status(201).send({ message: "subject added." });
    } catch {
      res.status(500);
    }
  };

  public updateSub = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No subject found." });
      return;
    }
    const id = parseInt(req.params.id);
    const result = await repo.findSubInDataBase(id);

    if (!result) {
      res.status(404).send({ message: "subject not found." });
      return;
    }

    repo.update(id, req.body);
    res.status(200).send({ message: "subject updated." });
  };

  public deleteSub = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No subject found." });
      return;
    }
    const id = parseInt(req.params.id);
    if (!repo.deleteItem(id)) {
      res.status(404).send({ message: "subject not found." });
      return;
    }
    res.status(200).send({ message: "subject deleted." });
  };

  public teacherSubs = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No subject found." });
      return;
    }
    const result = await repo.teacherSubs(parseInt(req.params.id));
    res.status(201).send(result);
  };

  public registerForRoom = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { subjectId, roomId } = req.body;
    const result = await repo.registerForRoom(
      parseInt(subjectId),
      parseInt(roomId)
    );
    res.status(201).send(result);
  };
}
