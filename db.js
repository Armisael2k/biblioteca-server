const mysql = require('mysql');
const config = require('./config');

const connection = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.db
});

module.exports = connection;