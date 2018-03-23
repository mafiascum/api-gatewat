'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('OauthCodes', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDv4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      authorizationCode: {
        type: Sequelize.STRING
      },
      expiresAt: {
        type: Sequelize.DATE
      },
      redirectUri: {
        type: Sequelize.STRING
      },
      scope: {
        type: Sequelize.STRING
      },
      clientId: {
        type: Sequelize.STRING,
        references: {
          model: 'OauthClients',
          key: 'clientId'
        }
      },
      userId: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('OauthCodes');
  }
};