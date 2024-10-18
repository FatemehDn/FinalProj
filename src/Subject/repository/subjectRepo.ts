import { ISubject } from "../model/ISubject";
import { BasicRepo } from "../../basicRepo/basicRepository";
import models from "../../dataBase/models/index";
import subject from "../../dataBase/models/subject";

export class subjectRepo extends BasicRepo<ISubject> {
  constructor() {
    super(models.Subjects);
  }

  public async addUser(
    name: string,
    roomId: number,
    capacity: number,
    unit: number
  ): Promise<void> {
    models.Subjects.create({
      name: name,
      roomID: roomId,
      capacity: capacity,
      unit: unit,
    });
    return;
  }

  public async showAllSubs(): Promise<ISubject> {
    return models.Subjects.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: models.Room,
          attributes: ["id", "name"],
        },
        {
          model: models.User,
          attributes: ["id", "name", "meanTeachingMark"],
        },
      ],
    });
  }

  public async teacherSubs(teacherId: number): Promise<any> {
    const subjects = await models.Subjects.findAll({
      where: { teacherId: teacherId },
      attributes: ["id", "name", "teacherId"],
      include: [
        {
          model: models.Room,
          attributes: ["id", "name"],
        },
      ],
    });
    if (subjects.length === 0) {
      return { message: "No subjects found for this teacher." };
    } else return subjects;
  }

  public async registerForRoom(
    subjectId: number,
    roomId: number
  ): Promise<any> {
    const subject = await this.findSubInDataBase(subjectId);
    if (!subject) {
      return { message: "sub not found." };
    }
    const room = await this.findRoomById(roomId);
    if (!room) {
      return { message: "Room not found." };
    }

    if (subject.capacity > room.capacity) {
      return {
        message: `subject capacity (${subject.capacity}) is more than room capacity (${room.capacity}).`,
      };
    }
    await subject.update({ roomID: roomId });
    return { message: "sub registered for this room." };
  }
}
