// db.js
const mysql = require('mysql');

const Basedatos = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'base_datos_inventario_taller',
    multipleStatements: true // <-- ¡ESTA LÍNEA ES CRUCIAL!
});

// mysql.createConnection(err => {
//     if (err) {
//         console.error('Error al conectar a la base de datos: ', err);
//         return;
//     }
//     console.log('Conexión exitosa a la base de datos MySQL');
// });

module.exports = Basedatos;