const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Endpoint para obtener todos los clientes
router.get('/', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarTodosLosClientes`();', (err, results) => {
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

    const sql = 'CALL ListarClienteXId(?)';

    db.query(sql, [id], (err, result) => {
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
router.post('/crear-cliente/', async (req, res) => {
    const { Nombre, DNI, RUC, Telefono, Correo, Direccion } = req.body;
    try {
        await db.query('CALL IngresarCliente(?, ?, ?, ?, ?, ?)', [Nombre, DNI, RUC, Telefono, Correo, Direccion]); // Llama al procedimiento almacenado con parámetros
        res.status(201).json({ message: 'Cliente creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el cliente:', error);
        res.status(500).json({ error: 'Error al crear el cliente' });
    }
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
        Estado 
    } = req.body;

    // Verificación de parámetros
    // console.log('Datos recibidos para actualizar el cliente:', req.body); // Comentado

    if (!NombreCliente || !DNI || !Telefono || !CorreoElectronico || !Direccion || Estado === undefined) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Llamamos al procedimiento almacenado con los parámetros
    const sql = 'CALL `base_datos_inventario_taller`.`ActualizarCliente` (?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [
        id,  // Asegúrate de que el ID se pase correctamente
        NombreCliente, 
        DNI, 
        RUC, 
        Telefono, 
        CorreoElectronico, 
        Direccion, 
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

// Endpoint para eliminar un cliente
// Endpoint para "eliminar" cliente cambiando el estado a 0
router.put('/eliminar-cliente/:id', (req, res) => {
    const id = req.params.id;  // Captura el ID desde la ruta

    // Llamamos al procedimiento almacenado para cambiar el estado del cliente a 0 (inactivo)
    const sql = 'CALL `base_datos_inventario_taller`.`EliminarCliente` (?)';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al cambiar el estado del cliente:', err);
            return res.status(500).send('Error al eliminar el cliente');
        }

        // Si todo sale bien, devolvemos una respuesta de éxito
        res.json({ message: 'Cliente eliminado correctamente' });
    });
});

module.exports = router;