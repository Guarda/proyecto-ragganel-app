const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

// Endpoint para obtener todos los clientes
router.get('/', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarTodosLosClientes\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            // console.log(err); // Comentado
            return;
        }
        res.json(results[0]);
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;

    // Verifica si el ID es un número válido
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido o no proporcionado' });
    }

    const sql = `CALL \`${dbConfig.database}\`.\`ListarClienteXId\`(?)`;

    Basedatos.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener el cliente:', err);
            return res.status(500).json({ error: 'Error al buscar cliente' });
        }

        // Verificar si el resultado tiene datos
        if (!result || result.length === 0 || !Array.isArray(result[0]) || result[0].length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.json(result[0][0]); // Retorna el primer objeto dentro del primer array
    });
});

// Endpoint para crear un nuevo cliente
// Endpoint para crear un nuevo cliente
router.post('/crear-cliente/', (req, res) => {
    const { Nombre, DNI, RUC, Telefono, Correo, Direccion, Comentarios } = req.body;
    
    // 1. LLAMADA ÚNICA QUE INSERTA Y DEVUELVE EL ID
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`IngresarCliente\`(?, ?, ?, ?, ?, ?, ?)`, 
    [Nombre, DNI, RUC, Telefono, Correo, Direccion, Comentarios], 
    (err, result) => {
        if (err || result.length === 0) {
            console.error('Error al ejecutar IngresarCliente:', err);
            return res.status(500).json({ error: 'Error al crear el cliente' });
        }

        // El ID ahora viene directamente en el resultado de la primera llamada
        const nuevoClienteId = result[0][0].id;

        // 2. LLAMADA PARA OBTENER EL CLIENTE COMPLETO
        Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarClienteXId\`(?)`, [nuevoClienteId], (err, finalResult) => {
            if (err || finalResult[0].length === 0) {
                return res.status(500).json({ error: 'No se pudo encontrar el cliente recién creado' });
            }
            
            res.status(201).json({
                message: 'Cliente creado exitosamente',
                nuevoCliente: finalResult[0][0]
            });
        });
    });
});

// Endpoint para actualizar un cliente
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

    // Verificación de parámetros
    // console.log('Datos recibidos para actualizar el cliente:', req.body); // Comentado

    if (!NombreCliente || !DNI || !Telefono || !CorreoElectronico || !Direccion || Estado === undefined) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Llamamos al procedimiento almacenado con los parámetros
    const sql = `CALL \`${dbConfig.database}\`.\`ActualizarCliente\` (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    Basedatos.query(sql, [
        id,  // Asegúrate de que el ID se pase correctamente
        NombreCliente, 
        DNI, 
        RUC, 
        Telefono, 
        CorreoElectronico, 
        Direccion, 
        Estado,
        Comentarios
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