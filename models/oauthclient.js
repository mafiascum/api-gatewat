'use strict';
module.exports = function(sequelize, DataTypes) {
  var OauthClient = sequelize.define('OauthClient', {
    clientId: DataTypes.STRING,
    clientSecret: DataTypes.STRING,
    redirectUri: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  OauthClient.removeAttribute('id');
  return OauthClient;
};