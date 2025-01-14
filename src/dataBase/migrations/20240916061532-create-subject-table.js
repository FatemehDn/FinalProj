"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subjects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      roomID: {
        type: Sequelize.INTEGER, 
        allowNull: true,
        references: {
          model: "rooms", 
           key: 'id'
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("subjects");
  },
};
