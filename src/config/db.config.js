const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Yehtet@2481998',
    database: 'trade_mark',
});

connection.connect(error => {
    if (error) throw error;
    console.log('Successfully connected to the database');
});

module.exports = connection;
