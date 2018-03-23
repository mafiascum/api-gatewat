'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('OauthTokens', {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDv4,
        primaryKey: true,
        type: Sequelize.UUID
      },
      accessToken: {
        type: Sequelize.TEXT
      },
      accessTokenExpiresAt: {
        type: Sequelize.DATE
      },
      clientId: {
        type: Sequelize.STRING,
        references: {
          model: 'OauthClients',
          key: 'clientId'
        }
      },
      refreshToken: {
        type: Sequelize.STRING
      },
      refreshTokenExpiresAt: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('OauthTokens');
  }
};