'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('OauthClients', {
      clientId: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      clientSecret: {
        type: Sequelize.STRING
      },
      redirectUri: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('OauthClients');
  }
};