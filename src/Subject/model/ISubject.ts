import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export interface ISubject
  extends Model<InferAttributes<ISubject>, InferCreationAttributes<ISubject>> {
  id: CreationOptional<number>;
  name: string;
  roomID: number;
}
