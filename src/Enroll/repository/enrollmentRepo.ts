import { IEnrollment } from "../model/Interface";
import { BasicRepo } from "../../basicRepo/basicRepository";
import jwt from "jsonwebtoken";
import models from "../../dataBase/models/index";
import { where } from "sequelize";
import user from "../../dataBase/models/user";
import { log } from "console";
import { findUserWithToken } from "../../utils/findUserWithToken";

interface JwtType {
  id: number;
  name: string;
}

export class EnrollmentRepo extends BasicRepo<IEnrollment> {
  constructor() {
    super(models.Enrollment);
  }

  public async addEnrollmentById(subjectId: number, token: any): Promise<any> {
    const { flag, message } = await this.checkSubjectCapacity(subjectId);
    if (!flag) {
      return message;
    }

    const user = await this.getUserFromToken(token);
    if (!user) return { message: "User not found." };

    const maxUnitsAllowed = this.getMaxUnitsByGPA(user.meanStudingMark);
    const currentActiveUnits = await this.getCurrentActiveUnits(user.id);
    const courseUnits = await this.getCourseUnits(subjectId);
    if (!courseUnits) return { message: "subject not found." };
    if (!(currentActiveUnits + courseUnits <= maxUnitsAllowed))
      return {
        message: `you are exeed the max allowed ${maxUnitsAllowed} units based on your GPA.`,
      };

    const { flag2, message2 } = await this.canEnrollInCourse(
      subjectId,
      user.id
    );
    if (!flag2) {
      return { message2 };
    }
    await models.Enrollment.create({
      userId: user.id,
      subjectId: subjectId,
    });

    return { message: "enroll added." };
  }

  private async getUserFromToken(token: any): Promise<any> {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtType;
    return await models.User.findOne({ where: { name: decoded.name } as any });
  }

  public async checkSubjectCapacity(subjectId: number): Promise<any> {
    const subject = await models.Subjects.findByPk(subjectId);

    if (!subject) {
      return { flag: false, message: "Subject not found." };
    }
    const activeStudentsCount = await models.Enrollment.count({
      where: {
        subjectId: subjectId,
        mark: null,
      },
    });

    if (activeStudentsCount + 1 > subject.capacity) {
      return {
        flag: false,
        message:
          "Subject capacity has reached to max. No more students can be enrolled.",
      };
    }
    return { flag: true, message: "" };
  }

  private getMaxUnitsByGPA(gpa: number): number {
    if (gpa > 16) return 24;
    if (gpa >= 12 && gpa <= 16) return 20;
    return 12;
  }

  private async getCurrentActiveUnits(userId: number): Promise<number> {
    const enrollments = await models.Enrollment.findAll({
      where: { userId: userId, mark: null },
      include: [
        {
          model: models.Subjects,
          attributes: ["unit"],
        },
      ],
    });

    let totalUnits = 0;
    for (const enrollment of enrollments) {
      totalUnits += enrollment.Subject?.unit || 0;
    }

    return totalUnits;
  }

  private async getCourseUnits(subjectId: number): Promise<number | null> {
    const course = await models.Subjects.findOne({ where: { id: subjectId } });
    return course.unit;
  }

  public async canEnrollInCourse(
    subjectId: number,
    userId: number
  ): Promise<any> {
    const enrollments = await models.Enrollment.findAll({
      where: { subjectId: subjectId, userId: userId },
    });

    if (enrollments.length == 0) {
      return {
        flag2: true,
      };
    }

    for (const enrollment of enrollments) {
      if (enrollment.mark == null) {
        return {
          flag2: false,
          message2: "user is still active in previous enroll for this sub.",
        };
      }
      if (enrollment.mark != null && enrollment.mark >= 10) {
        return {
          flag2: false,
          message2:
            "User has pass the sub in previous enrollment. he cant register again.",
        };
      }
    }
    return { flag2: true };
  }

  public async getEnrollsByUserId(userId?: number): Promise<void> {
    return models.Enrollment.findAll({
      where: { userId: userId },
      include: [
        {
          model: models.Subjects,
          attributes: ["name"],
          //teacher
          include: [{ model: models.User, attributes: ["id", "name"] }],
        },
      ],
    });
  }

  public async setMark(
    userId: number,
    subjectId: number,
    mark: number,
    teacher: any
  ): Promise<any> {
    const enroll = await models.Enrollment.findOne({
      where: { subjectId: subjectId, userId: userId, mark: null },
    });

    if (!enroll) {
      return {
        flag: false,
        message: "this user is not active in this subject.",
      };
    }
    const checkTeacher = await this.checkValidTeacher(subjectId, teacher.id);
    if (!checkTeacher) {
      return {
        flag: false,
        message: "you are not the teacher of this subject.",
      };
    }
    await enroll.update({ mark: mark });
    const allEnrollments = await this.getAllUserEnrollments(userId);
    const newGPA = this.calcGPA(allEnrollments);

    await models.User.update(
      { meanStudingMark: newGPA },
      { where: { id: userId } }
    );

    return { flag: true, message: "mark set." };
  }

  private async checkValidTeacher(subjectId: number, teacherId: number) {
    const subject = await this.findSubInDataBase(subjectId);
    console.log(subject.teacherId == teacherId);

    if (subject.teacherId == teacherId) {
      console.log("hi");

      return true;
    }
    return false;
  }

  public async getActiveUsersOfTeacher(id: number): Promise<any> {
    const subjects = await models.Subjects.findAll({
      where: { teacherId: id },
    });

    if (subjects.length == 0) {
      return {
        message: "No subjects assigned to you.",
      };
    }
    const subjectIds = subjects.map((sub: any) => sub.toJSON().id);

    const activeEnrollments = await models.Enrollment.findAll({
      where: {
        subjectId: subjectIds,
        mark: null,
      },
      include: [
        {
          model: models.User,
          attributes: ["id", "name"],
        },
        {
          model: models.Subjects,
          attributes: ["id", "name"],
          include: [
            {
              //teacher
              model: models.User,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      attributes: ["userId", "subjectId"],
    });
    return activeEnrollments;
  }

  private async getAllUserEnrollments(userId: number): Promise<any[]> {
    return models.Enrollment.findAll({
      where: { userId },
      include: [
        {
          model: models.Subjects,
          attributes: ["unit"],
        },
      ],
    });
  }

  public getValidEnrollments(allEnrollments: any[]) {
    // interface Enrollment {
    //   mark: number;
    //   unit: number;
    //   subjectId: number;
    // }
    const validEnrollments = [];

    for (const enrollment of allEnrollments) {
      if (enrollment.mark != null) {
        const enrollmentObj = {
          mark: enrollment.mark,
          unit: enrollment.Subject.unit,
          subjectId: enrollment.subjectId,
        };

        validEnrollments.push(enrollmentObj);
      }
    }
    console.log(validEnrollments);

    return validEnrollments;
  }

  public createMarksMap(marksWithUnits: any) {
    const marksMap: { [key: number]: { mark: number; unit: number } } = {};

    marksWithUnits.forEach((item: any) => {
      const subjectId = item.subjectId;
      const mark = item.mark;
      const unit = item.unit;

      if (mark >= 10) {
        marksMap[subjectId] = { mark, unit };
      } else {
        if (!(subjectId in marksMap)) {
          marksMap[subjectId] = { mark, unit };
        }
      }
    });

    return marksMap;
  }

  public calcGPA(allEnrollments: any[]): number {
    const marksWithUnits = this.getValidEnrollments(allEnrollments);
    const marksMap = this.createMarksMap(marksWithUnits);

    var sumProduct = 0;
    var sumUnits = 0;

    for (let subjectId in marksMap) {
      var item = marksMap[subjectId];
      sumProduct += item.mark * item.unit;
      sumUnits += item.unit;
    }
    var gpa = 0;
    if (sumUnits > 0) {
      gpa = sumProduct / sumUnits;
    }
    return gpa;
  }
}
