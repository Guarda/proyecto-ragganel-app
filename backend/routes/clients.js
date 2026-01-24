const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');


router.get('/', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarTodosLosClientes\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');

            return;
        }
        res.json(results[0]);
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido o no proporcionado' });
    }

    const sql = `CALL \`${dbConfig.database}\`.\`ListarClienteXId\`(?)`;

    Basedatos.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener el cliente:', err);
            return res.status(500).json({ error: 'Error al buscar cliente' });
        }

        if (!result || result.length === 0 || !Array.isArray(result[0]) || result[0].length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json(result[0][0]); 
    });
});


router.post('/crear-cliente/', (req, res) => {
    const { Nombre, DNI, RUC, Telefono, Correo, Direccion, Comentarios } = req.body;

    const sql = `CALL \`${dbConfig.database}\`.\`IngresarCliente\`(?, ?, ?, ?, ?, ?, ?)`;
    const params = [Nombre, DNI, RUC, Telefono, Correo, Direccion, Comentarios];

    Basedatos.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error al ejecutar el procedimiento almacenado IngresarCliente:', err);
            return res.status(500).json({ error: 'Error en la base de datos al crear el cliente.' });
        }


        const rows = result[0];

        if (!rows || !Array.isArray(rows) || rows.length === 0) {
            console.error(
                'El procedimiento IngresarCliente no devolvió el cliente esperado. ' +
                'Asegúrese de que el SP en la base de datos termina con "SELECT * FROM Clientes WHERE IdClientePK = LAST_INSERT_ID();". ' +
                'Resultado recibido:', JSON.stringify(result, null, 2)
            );
            return res.status(500).json({ error: 'Error al obtener los datos del cliente recién creado.' });
        }

        res.status(201).json({
            message: 'Cliente creado exitosamente',
            nuevoCliente: rows[0]
        });
    });
});


router.put('/actualizar-cliente/:id', (req, res) => {
    const id = req.params.id;  // Captura el ID desde la ruta

    const { 
        Nombre: NombreCliente, 
        DNI, 
        RUC, 
        Telefono, 
        Correo: CorreoElectronico, 
        Direccion,
        Comentarios, 
        Estado 
    } = req.body;

    // Validación básica de los campos más importantes.
    if (!NombreCliente || typeof Estado === 'undefined') {
        return res.status(400).json({ error: 'El nombre y el estado son requeridos.' });
    }

    // Llamamos al procedimiento almacenado con los parámetros en el orden correcto.
    const sql = `CALL \`${dbConfig.database}\`.\`ActualizarCliente\` (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    Basedatos.query(sql, [
        id,
        NombreCliente, 
        DNI, 
        RUC, 
        Telefono, 
        CorreoElectronico, 
        Direccion, 
        Comentarios,
        Estado
    ], (err, result) => {
        if (err) {
            console.error('Error actualizando cliente:', err);
            return res.status(500).send('Error al actualizar el cliente');
        }

        // Responder con éxito
        res.json({ message: 'Cliente actualizado con éxito' });
    });
});

router.get('/:id/ventas', (req, res) => {
    const idCliente = req.params.id;

    if (!idCliente || isNaN(idCliente)) {
        return res.status(400).json({ error: 'ID de cliente inválido o no proporcionado' });
    }

    const sql = `CALL \`${dbConfig.database}\`.\`sp_ObtenerVentasPorCliente\`(?)`;

    Basedatos.query(sql, [idCliente], (err, results) => {
        if (err) {
            console.error('Error al obtener ventas del cliente:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        // El resultado del SP está en el primer elemento del array
        res.json(results[0]);
    });
});

// Endpoint para eliminar un cliente
// Endpoint para "eliminar" cliente cambiando el estado a 0
router.put('/eliminar-cliente/:id', (req, res) => {
    const id = req.params.id;  // Captura el ID desde la ruta

    // Llamamos al procedimiento almacenado para cambiar el estado del cliente a 0 (inactivo)
    const sql = `CALL \`${dbConfig.database}\`.\`EliminarCliente\` (?)`;

    Basedatos.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al cambiar el estado del cliente:', err);
            return res.status(500).send('Error al eliminar el cliente');
        }

        // Si todo sale bien, devolvemos una respuesta de éxito
        res.json({ message: 'Cliente eliminado correctamente' });
    });
});

module.exports = router;