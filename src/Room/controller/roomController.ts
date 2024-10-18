// UserController.ts
import { Request, Response, NextFunction } from "express";
import { roomRepo } from "../repository/roomRepo";

const repo = new roomRepo();
export class RoomController {
  constructor() {}

  public getAllRooms = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No room found." });
      return;
    }
    const users = await repo.getData();
    res.json(users);
  };

  public getRoomById = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No room found." });
      return;
    }
    const id = parseInt(req.params.id);
    const find = await repo.findById(id);
    if (find == null) {
      res.status(404).send({ message: "Room not found." });
      return;
    }
    res.status(200).send(find);
  };

  public addRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, capacity } = req.body;
      const result = await repo.addRoom(name, capacity);
      res.status(201).send(result.message);
    } catch {
      res.status(500);
    }
  };

  public updateRoom = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No room found." });
      return;
    }
    const id = parseInt(req.params.id);
    const result = await repo.idExists(id);

    if (!result) {
      res.status(404).send({ message: "Room not found." });
      return;
    }

    repo.update(id, req.body);
    res.status(200).send({ message: "Room updated." });
  };

  public deleteRoom = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No room found." });
      return;
    }
    const id = parseInt(req.params.id);
    if (!repo.deleteItem(id)) {
      res.status(404).send({ message: "Room not found." });
      return;
    }
    res.status(200).send({ message: "Room deleted." });
  };
}
