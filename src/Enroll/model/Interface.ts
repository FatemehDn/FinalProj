import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export interface IEnrollment
  extends Model<
    InferAttributes<IEnrollment>,
    InferCreationAttributes<IEnrollment>
  > {
  id: CreationOptional<number>;
  userId: number;
  subjectId: number;
  mark: number;
  teacherId: number;
}
