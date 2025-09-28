// db.js
const mysql = require('mysql2');

// Cargar dotenv para leer las variables de entorno del archivo .env
require('dotenv').config();

// Define la configuración de la base de datos usando variables de entorno
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password', // Es mejor no tener una contraseña por defecto
    database: process.env.DB_DATABASE || 'base_datos_inventario_taller',
    multipleStatements: true
};

// Usar un pool de conexiones es más robusto para una aplicación web que createConnection
const Basedatos = mysql.createPool(dbConfig);

// Exporta la conexión, la configuración y el entorno actual para usarlo en otros lugares
module.exports = {
    Basedatos,
    dbConfig,
    environment: process.env.NODE_ENV || 'development'
};