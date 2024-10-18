import { Request, Response, NextFunction } from "express";
import { userRepo } from "../repository/userRepo";
import bcrypt from "bcrypt";
import { onlineUsers } from "../../socket/functions";
import { Server as SocketIOServer } from "socket.io";
import { notifyUsersAboutTeacherChange } from "../../socket/notificationService";
const repo = new userRepo();

export class UserController {
  constructor() {}

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No user found." });
      return;
    }
    const users = await repo.showUserData();
    res.json(users);
  };

  public getUserById = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No user found." });
      return;
    }
    const id = parseInt(req.params.id);
    const find = await repo.findUserInfoById(id);
    if (find == null) {
      res.status(404).send({ message: "User not found." });
      return;
    }
    res.status(200).send(find);
  };

  public addUser = async (req: Request, res: Response) => {
    try {
      const { name, role, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      repo.addUser(name, role, hashedPassword);
      res.status(201).send({ message: "User added." });
    } catch {
      res.status(500);
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No user found." });
      return;
    }
    const { id, name, password } = req.body;
    const result = await repo.findUserById(id);

    if (!result) {
      res.status(404).send({ message: "User not found." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await repo.updateUser(id, name, hashedPassword);
    res.status(200).send({ message: "User updated." });
  };

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No user found." });
      return;
    }
    const id = parseInt(req.params.id);
    if (!repo.deleteItem(id)) {
      res.status(404).send({ message: "User not found." });
      return;
    }
    res.status(200).send({ message: "User deleted." });
  };

  public setTeacher = async (req: Request, res: Response): Promise<void> => {
    const isTableEmpty = await repo.isTableEmpty();
    if (isTableEmpty) {
      res.status(404).send({ message: "No user found." });
      return;
    }
    const { userId, subjectId, role } = req.body;

    const result = await repo.setTeacher(userId, subjectId, role);

    if (result.message === "role updated.") {
      const subject = await repo.findSubInDataBase(subjectId);
      await notifyUsersAboutTeacherChange(subjectId, userId, subject.name, repo);
    }
    res.status(200).json(result);
  };

}
