import { ITeacherMarks } from "../model/ITeacherMarks";
import { BasicRepo } from "../../basicRepo/basicRepository";
import models from "../../dataBase/models/index";
import enrollment from "../../dataBase/models/enrollment";
import { calculateMean } from "../../utils/calculateMean";

export class teacherMarksRepo extends BasicRepo<ITeacherMarks> {
  constructor() {
    super(models.Room);
  }

  public async addTeacherMark(
    enrollmentId: number,
    mark: number
  ): Promise<any> {
    const existMark = await models.TeachersMark.findOne({enrollmentId:enrollmentId})
    if(existMark){
      return {
        flag: false,
        message:
          "you already set mark for this enrollment" };
    }
    const enrollment = await this.findEnrollment(enrollmentId);
  
    if (!enrollment) {
      return {
        flag: false,
        message:
          "this enrollment id is not exists.",
      };
    }

    await models.TeachersMark.create({
      enrollmentId,
      mark,
    });
    const newGPA = await this.calculateTeacherGPA(enrollment.teacherId);
    await this.updateTeacherGPA(enrollment.teacherId, newGPA);
    return { flag: true, message: "Teacher mark added successfully." };
  }


  public isEnrollmentOwnedByUser = async (
    enrollmentId: number,
    userId: number
  ): Promise<boolean> => {
    const enrollment = await models.Enrollment.findOne({
      where: {
        id: enrollmentId,
        userId: userId,
      },
    });

    return enrollment;
  };

  public async calculateTeacherGPA(teacherId: number) {
    const allMarks = await models.TeachersMark.findAll({
      include: [
        {
          model: models.Enrollment,
          attributes: [],
          where: { teacherId },
        },
      ],
      attributes: ["mark"],
    });

    const marksArray = allMarks.map((one: { mark: any }) => one.mark);
    const mean = calculateMean(marksArray);
    return isNaN(mean) ? 0 : mean;
  }

  public async updateTeacherGPA(teacherId: number, averageMark: number) {
    await models.User.update(
      { meanTeachingMark: averageMark },
      { where: { id: teacherId } }
    );
  }
}
