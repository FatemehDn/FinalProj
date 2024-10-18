import { IFavorites } from "../model/IFavorites";
import { BasicRepo } from "../../basicRepo/basicRepository";
import models from "../../dataBase/models/index";
import subject from "../../dataBase/models/subject";
import user from "../../dataBase/models/user";

export class favoritesRepo extends BasicRepo<IFavorites> {
  constructor() {
    super(models.Favorites);
  }

  public async addFave(userId: number, subjectId: number): Promise<IFavorites> {
    return models.Favorites.create({
      userId: userId,
      subjectId: subjectId,
    });
  }

  public async isSubjectAlreadyFavorite(userId: number, subjectId: number): Promise<boolean> {
    const favorite = await models.Favorites.findOne({
      where: {
        userId: userId,
        subjectId: subjectId,
      },
    });

    return favorite; 
  }
  public async getFavoritesByUserId(userId: number): Promise<IFavorites[]> {
    return models.Favorites.findAll({
      where: { userId: userId },
      include: [
        {
          model: models.Subjects,
          attributes: ["id", "name"],
        },
      ],
    });
  }

  public async deleteFaveBySubjectId(
    subjectId: number,
    userId: number,
    role: string
  ): Promise<boolean> {
    let favorite = await models.Favorites.findOne({
      where: {
        subjectId: subjectId,
        userId: userId,
      },
    });
    if (!favorite) {
      return false;
    }
    await favorite.destroy();
    return true;
  }
}
