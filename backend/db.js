// db.js
const mysql = require('mysql');

const Basedatos = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'base_datos_inventario_taller'

});


module.exports = Basedatos;