import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export interface IUser
  extends Model<InferAttributes<IUser>, InferCreationAttributes<IUser>> {
  id: CreationOptional<number>;
  name: string;
  role: string;
  password: string;
}
