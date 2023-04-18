var mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
});
  
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

module.exports = connection;