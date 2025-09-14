// db.js
const mysql = require('mysql2');

// 1. Cargar dotenv para leer las variables de entorno
require('dotenv').config({
    path: process.env.NODE_ENV === 'production' ? './.env.production' : './.env.development'
});

// Define la configuración de la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password', // Asegúrate que esta sea tu contraseña correcta
    // 2. Lee el nombre de la base de datos desde las variables de entorno
    // Si no se encuentra, usa la de prueba por seguridad.
    database: process.env.DB_NAME || 'base_datos_inventario_taller_prueba',
    multipleStatements: true
};

// 3. Usar un pool de conexiones es más robusto para una aplicación web que createConnection
const Basedatos = mysql.createPool(dbConfig);

// 4. Exporta la conexión, la configuración y el entorno actual para usarlo en otros lugares
module.exports = {
    Basedatos,
    dbConfig,
    environment: process.env.NODE_ENV || 'development'
};