"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("enrollment", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", 
           key: 'id'
        },
      },
      subjectId: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: "subjects", 
           key: 'id'
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("enrollment");
  },
};
