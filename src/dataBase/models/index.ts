import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";

const config = require(__dirname + "/../config/config.json");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

interface Db {
  [key: string]: any;
}

const db: Db = {};

let sequelize: Sequelize;
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable]!, dbConfig);
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  );
}

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.endsWith(".ts") &&
      !file.endsWith(".test.ts")
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file)).default(
      sequelize,
      DataTypes
    );
    if (model) {
      db[model.name] = model;
      console.log(`Model loaded: ${model.name}`);
    }
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

if (
  db.User &&
  db.Enrollment &&
  db.Subjects &&
  db.TeachersMark &&
  db.Favorites
) {
  db.Enrollment.belongsTo(db.User, { foreignKey: "userId", as: "enrollments" });
  db.User.hasMany(db.Enrollment, { foreignKey: "userId", as: "enrollments" });
  db.Enrollment.belongsTo(db.Subjects, { foreignKey: "subjectId" });
  db.Subjects.hasMany(db.Enrollment, { foreignKey: "subjectId" });
  db.Subjects.belongsTo(db.User, { foreignKey: "teacherId" });
  db.User.hasMany(db.Subjects, { foreignKey: "teacherId" });
  db.Subjects.belongsTo(db.Room, { foreignKey: "roomID" });
  db.Room.hasMany(db.Subjects, { foreignKey: "roomID" });
  db.Enrollment.hasOne(db.TeachersMark, { foreignKey: "enrollmentId" });
  db.TeachersMark.belongsTo(db.Enrollment, { foreignKey: "enrollmentId" });
  db.Enrollment.belongsTo(db.User, { foreignKey: "teacherId" });
  db.User.hasMany(db.Enrollment, { foreignKey: "teacherId" });
  db.Favorites.belongsTo(db.User, { foreignKey: "userId" });
  db.User.hasMany(db.Favorites, { foreignKey: "userId" });
  db.Favorites.belongsTo(db.Subjects, { foreignKey: "subjectId" });
  db.Subjects.hasMany(db.Favorites, { foreignKey: "subjectId" });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
