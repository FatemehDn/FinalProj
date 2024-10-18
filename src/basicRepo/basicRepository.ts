import { Model, ModelStatic, where } from "sequelize";
import models from "../dataBase/models/index";
import user from "../dataBase/models/user";
import Favorites from "../dataBase/models/Favorites";

export class BasicRepo<T extends Model> {
  private list: T[] = [];
  private model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  public async getData(): Promise<T[]> {
    return await this.model.findAll();
  }

  public async findById(inputId: number): Promise<T | null> {
    const result = await this.model.findByPk(inputId, {
      attributes: { exclude: ["password"] },
    });
    return result;
  }

  public async update(id: number, bodyData: T): Promise<void> {
    const item = await this.model.findByPk(id);
    if (item) {
      await this.model.update(bodyData, {
        where: {
          id: id,
        } as any,
      });
    } else {
      throw new Error("Item not found");
    }
  }

  public async deleteItem(inputId: number): Promise<boolean> {
    const result = await this.model.destroy({
      where: { id: inputId } as any,
    });

    if (result === 0) {
      return false;
    }
    return true;
  }

  public async isTableEmpty(): Promise<boolean> {
    console.log("Model:", this.model);
    const count = await this.model.count();
    if (count === 0) {
      return true;
    }
    return false;
  }
  public async idExists(inputId: number): Promise<any> {
    const item = await this.model.findByPk(inputId);
    console.log(item);

    if (item == null) {
      return false;
    } else {
      return JSON.parse(JSON.stringify(item));
    }
  }

  public async findeByName(name: string): Promise<T | null> {
    console.log(this.model);

    const item = await this.model.findOne({ where: { name: name } as any });
    // console.log("hello" + item);

    return item;
  }

  //Data Base
  public async findSubInDataBase(subjectId: number) {
    const subject = await models.Subjects.findByPk(subjectId);
    return subject;
  }
  public async findUserById(userId: number) {
    const user = await models.User.findByPk(userId);
    return user;
  }

  public async findRoomById(roomId: number): Promise<any> {
    const room = models.Room.findByPk(roomId);
    return room;
  }

  public async findEnrollment(enrollmentId: number) {
    const enroll = models.Enrollment.findOne({
      where: {
        id: enrollmentId,
      },
    });
    return enroll;
  }

  public async findActiveUsers(subjectId: number) {
    const enroll = models.Enrollment.findAll({
      where: {
        subjectId: subjectId,
        mark: null,
      },
    });
    return enroll;
  }
  public async findStudentsWithFavoriteSubject(subjectId: number) {
    const list = models.Favorites.findAll({
      where: {
        subjectId: subjectId,
      },
    });
    return list;
  }
}
