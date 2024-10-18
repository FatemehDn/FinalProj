
import { Model, DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class Subject extends Model {
    static associate(models: any) {}
  }

  Subject.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "rooms",
          key: "id",
        },
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      unit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      sequelize,
      modelName: "Subjects",
      tableName: 'Subjects',
      timestamps: false,
    }
  );

  return Subject;
};
