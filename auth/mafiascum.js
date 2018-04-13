const db = require('../models');
const bcrypt = require('bcryptjs');
const stringUtils = require('../utils/string');

async function authenticate(username, password) {
    if (!username || !password) {
        return false;
    }
    
    const usernameClean = stringUtils.utf8CleanString(username);

    const result = await db.sequelize.query(
        `SELECT * FROM phpbb_users WHERE username_clean = $1`, 
        {bind: [usernameClean], type: db.sequelize.QueryTypes.SELECT }
    );

    if (!result.length) {
        return false;
    }

    const row = result[0];

    //user inactive or user ignore
    if (row.user_type == 1 || row.user_type == 2) {
        return false;
    }
  
    return bcrypt.compareSync(password, row.user_password) ? {id: row.user_id} : false;
}

module.exports = authenticate;