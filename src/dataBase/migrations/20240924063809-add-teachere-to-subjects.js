'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('subjects', 'teacherId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "users", 
         key: 'id'
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('subjects', 'teacherId');
  }
};
