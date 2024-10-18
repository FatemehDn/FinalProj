import { Model, DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class TeacherMark extends Model {
    static associate(models: any) {}
  }

  TeacherMark.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      enrollmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "enrollment",
          key: "id",
        },
        unique: true,
      },
      mark: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TeachersMark",
      tableName: "TeachersMarks",
      timestamps: false,
    }
  );

  return TeacherMark;
};
