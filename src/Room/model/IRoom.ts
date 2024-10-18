import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export interface IRoom
  extends Model<InferAttributes<IRoom>, InferCreationAttributes<IRoom>> {
  id: CreationOptional<number>;
  name: string;
  capacity: number;
}
