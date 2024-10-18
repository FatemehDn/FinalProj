import { Model, DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class Enrollment extends Model {
    static associate(models: any) {}
  }

  Enrollment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "subjects",
          key: "id",
        },
      },

      mark: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Enrollment",
      tableName: "enrollment",
      timestamps: false,
    }
  );

  return Enrollment;
};
