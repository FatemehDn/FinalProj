import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
  } from "sequelize";
  
  export interface IFavorites
    extends Model<InferAttributes<IFavorites>, InferCreationAttributes<IFavorites>> {
    id: CreationOptional<number>;
    userId: number;
    subjectId: number;
  }
  