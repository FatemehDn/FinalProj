"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "meanStudingMark", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.0, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "meanStudingMark", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: null, 
    });
  },
};
