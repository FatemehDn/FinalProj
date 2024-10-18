import { Model, DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class Favorites extends Model {
    static associate(models: any) {}
  }

  Favorites.init(
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
    },
    {
      sequelize,
      modelName: "Favorites",
      tableName: "favorites",
      timestamps: false,
    }
  );

  return Favorites;
};
