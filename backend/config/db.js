// Archivo: config/db.js
// VERSIÓN CORREGIDA

const mysql = require('mysql2');

// Cargar dotenv ya no se hace aquí, se hace en app.js
// require('dotenv').config(); 

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password', 
    database: process.env.DB_DATABASE || 'base_datos_inventario_taller',
    multipleStatements: true
};

const Basedatos = mysql.createPool(dbConfig);

module.exports = {
    Basedatos,
    dbConfig,
    environment: process.env.NODE_ENV || 'development'
};