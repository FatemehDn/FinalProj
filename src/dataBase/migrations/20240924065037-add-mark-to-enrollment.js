'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('enrollment', 'mark', {
      type: Sequelize.INTEGER, 
      allowNull: true, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('enrollment', 'mark');
  }
};
