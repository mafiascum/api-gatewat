'use strict';
module.exports = function(sequelize, DataTypes) {
  var OauthToken = sequelize.define('OauthToken', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    accessToken: DataTypes.TEXT,
    accessTokenExpiresAt: DataTypes.DATE,
    clientId: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    refreshTokenExpiresAt: DataTypes.DATE,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return OauthToken;
};