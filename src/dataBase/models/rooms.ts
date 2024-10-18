import { Model, DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  class Room extends Model {
    static associate(models: any) {}
  }

  Room.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    
    },
    {
      sequelize,
      tableName: 'rooms',
      modelName: "Room",
      timestamps: false,
    }
  );

  return Room;
};
