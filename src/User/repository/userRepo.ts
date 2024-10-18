import { IUser } from "../model/IUser";
import { BasicRepo } from "../../basicRepo/basicRepository";
import models from "../../dataBase/models/index";
import { getCache, setCache, deleteCache } from "../../redis/redisService";

export class userRepo extends BasicRepo<IUser> {
  constructor() {
    super(models.User);
  }

  public async addUser(
    name: string,
    role: string,
    password: string
  ): Promise<IUser> {
    return models.User.create({
      name: name,
      role: role,
      password: password,
    });
  }

  public async updateUser(id: number, name: string, password: string): Promise<void> {
    await models.User.update(
      { name: name, password: password },
      {
        where: {
          id: id,
        },
      }
    );
  }

  public async showUserData(): Promise<IUser[]> {
    const users = await models.User.findAll({
      attributes: { exclude: ["password"] },
    });

    return users;
  }
  public async findUserInfoById(inputId: number): Promise<IUser[]> {
    const cacheKey = `user:${inputId}`;
    // deleteCache(cacheKey)
    let userData = await getCache(cacheKey);
    if (!userData) {
      // Data not in cache, get it from database
      userData = await models.User.findByPk(inputId, {
        attributes: ["id", "name"],
        include: [
          {
            as: 'enrollments',
            model: models.Enrollment,
            attributes: ["id","teacherId","mark"],
            include: [
              {
                model: models.Subjects,
                attributes: ["name"],
              },
            ],
          },
        ],
      });

      if (userData) {
        await setCache(cacheKey, JSON.stringify(userData), 3600);
      }
    } else {
      // data is in redis
      userData = JSON.parse(userData);
    }
    return userData;
  }

  public async setTeacher(userId: number, subjectId: number, newRole: string) {
    const subject = await this.findSubInDataBase(subjectId);

    if (!subject) {
      return { message: "Subject not found" };
    }
    const user = await this.findUserById(userId);
    if (!user) {
      return { message: "User not found" };
    }
    if(subject.teacherId != null && newRole === "teacher"){
      return { message: "this sub already has a teacher." };
    }

    const maxUnitsAllowed = this.getMaxTeachingUnitsByGPA(user.meanTeachingMark);
    const currentTeachingUnits = await this.getCurrentTeachingUnits(userId);
    if ((currentTeachingUnits + subject.unit) > maxUnitsAllowed) {
      return { message: `can not assign this user as teacher because it exceed max units is based on his GPA: ${maxUnitsAllowed}` };
    }

    await user.update({ role: newRole });
    if (newRole === "teacher") {
      await subject.update({ teacherId: userId });
    } else {
      await subject.update({ teacherId: null });
    }
    return { message: "role updated." }
  }

  private getMaxTeachingUnitsByGPA(teachingGPA: number): number {
    if (teachingGPA >= 4) return 20;
    if (teachingGPA >= 3 && teachingGPA < 4) return 16;
    if (teachingGPA >= 2  && teachingGPA < 3) return 12;
    return 9;
  }
  

  private async getCurrentTeachingUnits(userId: number): Promise<number> {
    const totalUnits = await models.Subjects.sum('unit', { where: { teacherId: userId } });
    return totalUnits || 0;
  }
}
