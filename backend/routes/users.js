const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

const bcrypt = require('bcryptjs'); // Agrega bcrypt
const saltRounds = 10; // Número de rondas de encriptación

// List all users
router.get('/', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarUsuarios\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching users');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

//CREAR USUARIO

router.post('/crear-usuario', (req, res) => {
    const { Nombre, Correo, Password, IdEstadoFK, IdRol } = req.body;

    if (!Nombre || !Correo || !Password || !IdEstadoFK || !IdRol) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Encriptar la contraseña antes de insertarla
    bcrypt.hash(Password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error al encriptar la contraseña' });
        }

        // Usar la contraseña encriptada para el procedimiento almacenado
        const sql = `CALL \`${dbConfig.database}\`.\`InsertarUsuario\`(?, ?, ?, CURDATE(), ?, ?)`;
        Basedatos.query(sql, [Nombre, Correo, hashedPassword, IdEstadoFK, IdRol], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al insertar usuario', details: err });
            }
            res.json({ message: 'Usuario agregado correctamente', id: result.insertId });
        });
    });
});

// Obtener un usuario por ID
router.get('/listar-usuario/:id', (req, res) => {
    const { id } = req.params;

    const sql = `CALL \`${dbConfig.database}\`.\`ListarUsuarioPorId\`(?)`; // Llamando al procedimiento almacenado

    Basedatos.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (results[0].length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(results[0]); // Devolver el primer conjunto de resultados
    });
});
router.put('/actualizar-usuario/:id', (req, res) => {
    const { id } = req.params;
    const { NombreUsuario, CorreoUsuario, PasswordUsuario, IdEstadoUsuario, IdRolUsuario } = req.body;

    if (!NombreUsuario || !CorreoUsuario || !IdEstadoUsuario || !IdRolUsuario) {
        return res.status(400).json({ error: "Todos los campos obligatorios deben estar presentes" });
    }

    // Si la contraseña es proporcionada, encriptarla
    let updatedPassword = null;

    if (PasswordUsuario) {
        bcrypt.hash(PasswordUsuario, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: "Error al encriptar la contraseña" });
            }

            updatedPassword = hashedPassword;

            // Llamar a la función para actualizar los datos del usuario
            const sql = `CALL \`${dbConfig.database}\`.\`ActualizarUsuario\`(?, ?, ?, ?, ?, ?)`;
            Basedatos.query(sql, [id, NombreUsuario, CorreoUsuario, updatedPassword, IdEstadoUsuario, IdRolUsuario], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error al actualizar usuario', details: err });
                }
                res.json({ message: 'Usuario actualizado correctamente' });
            });
        });
    } else {
        // Si no se proporciona una nueva contraseña, actualizamos sin modificarla
        const sql = `CALL \`${dbConfig.database}\`.\`ActualizarUsuario\`(?, ?, ?, ?, ?, ?)`;
        Basedatos.query(sql, [id, NombreUsuario, CorreoUsuario, null, IdEstadoUsuario, IdRolUsuario], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar usuario', details: err });
            }
            res.json({ message: 'Usuario actualizado correctamente' });
        });
    }
});

// Endpoint para cambiar la contraseña de un usuario
router.put('/cambiar-password/:id', (req, res) => {
    const { id } = req.params;  // Obtener el ID del usuario desde los parámetros de la URL
    const { currentPassword, newPassword } = req.body;  // Obtener la contraseña actual y la nueva desde el cuerpo de la solicitud
    console.log('user' + id)
    console.log(req.body)
    // 1. Llamar al procedimiento almacenado para obtener la contraseña actual
    const sql = `CALL \`${dbConfig.database}\`.\`GetUserPassword\`(?)`;
    Basedatos.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener la contraseña del usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (results[0].length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const usuario = results[0][0]; // Usuario encontrado

        // 1. Encriptar la nueva contraseña directamente
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error al encriptar la nueva contraseña:', err);
                return res.status(500).json({ error: 'Error al encriptar la nueva contraseña' });
            }

            // 2. Llamar al procedimiento almacenado para actualizar la contraseña
            const updateSql = `CALL \`${dbConfig.database}\`.\`CambiarPassword\`(?, ?)`;
            Basedatos.query(updateSql, [id, hashedPassword], (err) => {
                if (err) {
                    console.error('Error al actualizar la contraseña:', err);
                    return res.status(500).json({ error: 'Error al actualizar la contraseña' });
                }

                // Respuesta exitosa
                res.json({ message: 'Contraseña actualizada exitosamente' });
            });
        });
    });
});

router.put('/desactivar-usuario/:id', (req, res) => {
    const { id } = req.params;
    const { IdEstadoUsuario } = req.body; // Nuevo estado (Ejemplo: 2 = Inactivo)

    if (!IdEstadoUsuario) {
        return res.status(400).json({ error: "IdEstadoUsuario es obligatorio" });
    }

    const query = `CALL \`${dbConfig.database}\`.\`DesactivarUsuario\`(?, ?)`;
    const values = [id, IdEstadoUsuario];

    Basedatos.query(query, values, (error, results) => {
        if (error) {
            console.error("Error al desactivar usuario:", error);
            return res.status(500).json({ error: "Error al desactivar usuario" });
        }
        res.json({ message: "Usuario desactivado correctamente" });
    });
});



module.exports = router;