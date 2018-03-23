/**
 * Module dependencies.
 */

const db = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

/*
 * Get access token.
 */

module.exports.getAccessToken = async function(accessToken) {
    const token = await db.OauthToken.findOne({where: {accessToken}});
    if (!token) {
        return;
    }
        
    return {
        accessToken: token.accessToken,
        client: {id: token.clientId},
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        user: {id: token.userId}
    };    
};

/**
 * Get client.
 */

module.exports.getClient = async function(clientId, clientSecret = null) {
    const oauthClient = await db.OauthClient.findOne({where: {clientId, clientSecret}});

    if (!oauthClient) {
        return;
    }

    return {
        id: oauthClient.clientId,
        grants: ['password'], // the list of OAuth2 grant types that should be allowed
    };
};

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = async function(refreshToken) {
    const token = await db.OauthToken.findOne({where: {refreshToken}});

    if (!token) {
        return;
    }
        
    return {
        refreshToken: token.refreshToken,
        client: {id: token.clientId},
        refreshTokenExpiresAt: token.accessTokenExpiresAt,
        user: {id: token.userId}
    };    
};

/*
 * Get user.
 */

module.exports.getUser = async function (username, password) {
    const result = await db.sequelize.query(
        `SELECT user_id, user_password as password_hash FROM phpbb_users WHERE username = $1`, 
        {bind: [username], type: db.sequelize.QueryTypes.SELECT }
    );

    if (!result) {
        return false;
    }

    const row = result[0];
  
    return bcrypt.compareSync(password, row.password_hash) ? {id: row.user_id} : false;
};

/**
 * Save token.
 */

module.exports.saveToken = async function (token, client, user) {
    const newToken = await db.OauthToken.create({
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        clientId: client.id,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        userId: user.id
    });

    if (!newToken) {
        return;
    }

    return {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        client: {id: client.id},
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        user: {id: user.id}
    }
};

module.exports.saveAuthorizationCode = async function(code, client, user) {
    const newCode = await db.OauthCode.create({
        authorizationCode: code.authorizationCode,
        expiresAt: code.expiresAt,
        redirectUri: code.redirectUri,
        clientId: client.id,
        userId: user.id
    });

    if (!newCode) {
        return;
    }

    return {
        authorizationCode: code.authorizationCode,
        expiresAt: code.expiresAt,
        redirectUri: code.redirectUri,
        client: {id: client.id},
        user: {id: user.id}
    };
};

module.exports.revokeToken = async function(token) {
    const numRows = await db.OauthToken.destroy({where: {refreshToken: token.refreshToken}});

    return !!numRows;
}

module.exports.revokeAuthorizationCode = async function(code) {
    const numRows = await db.OauthCode.destroy({where: {authorizationCode: code.code}});

    return !!numRows;
}

// possible we'll need JWT in the future, but we don't right now.
// module.exports.generateAccessToken = function(client, user, scope) {
//     const sharedKey = fs.readFileSync(process.env.JWT_SHARED_PRIVATE_KEY);

//     // using HS256 symmetric here since i expect verification to happen on this server too
//     // if that decision changes, i want the change to RS256 to be a deliberate one
//     // until then, do not give this shared secret out at all.
//     const token = jwt.sign({client, user, scope}, sharedKey, { algorithm: 'HS256'});
//     return token;
// }