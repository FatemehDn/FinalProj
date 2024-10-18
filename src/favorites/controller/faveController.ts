import { Request, Response, NextFunction } from "express";
import { favoritesRepo } from "../repository/faveRepo";
import { promises } from "dns";
import { findUserWithToken } from "../../utils/findUserWithToken";

const repo = new favoritesRepo();
export class favoritesController {
  constructor() {}

  public getFavesById = async (req: Request, res: Response): Promise<void> => {
    try {
      const isTableEmpty = await repo.isTableEmpty();
      if (isTableEmpty) {
        res.status(404).send({ message: "No favorite subjects found." });
        return;
      }

      const userId = parseInt(req.params.id);
      const user = await findUserWithToken(req, res);
      if (!user) {
        res.status(404).send({
          message: "user not found.",
        });
        return;
      }

      if (!this.isAuthorized(user.id, userId, user.role)) {
        res.status(403).send({
          message: "You do not have permission to view these favorites.",
        });
        return;
      }

      const favorites = await repo.getFavoritesByUserId(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error getting favorite subjects:", error);
    }
  };

  public isAuthorized = (
    loggedInUserId: number,
    userId: number,
    role: string
  ): boolean => {
    return loggedInUserId === userId || role === "admin";
  };

  public addNewFave = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await findUserWithToken(req, res);
      if (!user) {
        res.status(404).send({
          message: "user not found.",
        });
        return;
      }

      const { subjectId } = req.body;
      const subject = await repo.findSubInDataBase(subjectId);

      if (!subject) {
        res.status(404).send({ message: "Subject not found." });
        return;
      }

      const isAlreadyFavorite = await repo.isSubjectAlreadyFavorite(
        user.id,
        subjectId
      );
      if (isAlreadyFavorite) {
        res
          .status(400)
          .send({ message: "Subject is already in your favorites." });
        return;
      }
      await repo.addFave(user.id, parseInt(subjectId));

      res.status(201).send({ message: "Favorite added successfully." });
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  public deleteFave = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await findUserWithToken(req, res);
      if (!user) return;

      const { subjectId } = req.body;
      if (!subjectId) {
        res.status(400).send({ message: "Subject not found." });
        return;
      }

      const isDeleted = await repo.deleteFaveBySubjectId(
        user.id,
        subjectId,
        user.role
      );

      if (isDeleted) {
        res.status(200).send({ message: "Favorite deleted successfully." });
      } else {
        res.status(404).send({ message: "Favorite not found." });
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };
}
