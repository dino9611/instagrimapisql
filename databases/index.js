const mysql = require('mysql')

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'saitama',
//     password: 'abc123',
//     database: 'instagrin',
//     port: 3306,
//     // multipleStatements: true
//     // timezone: 'UTC'
// })
const db = mysql.createConnection({
    host: 'localhost',
    user: 'saitama',
    password: 'Pl163178149;',
    database: 'instagrin',
    port: 3306,
    // multipleStatements: true
    // timezone: 'UTC'
})

module.exports = {
    sqlDB: db
}