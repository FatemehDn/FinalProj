import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from "sequelize";
  
  export interface ITeacherMarks
    extends Model<InferAttributes<ITeacherMarks>, InferCreationAttributes<ITeacherMarks>> {
    id: CreationOptional<number>;
    enrollmentId:number,
    mark:number
  }
  