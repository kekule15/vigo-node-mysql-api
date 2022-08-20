require('dotenv').config();

const sql = require('mysql2');


const db = sql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    port: 8888

})



module.exports = db;