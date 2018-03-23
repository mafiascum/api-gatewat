'use strict';
module.exports = function(sequelize, DataTypes) {
  var OauthCode = sequelize.define('OauthCode', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    authorizationCode: DataTypes.STRING,
    expiresAt: DataTypes.DATE,
    redirectUri: DataTypes.STRING,
    scope: DataTypes.STRING,
    clientId: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return OauthCode;
};