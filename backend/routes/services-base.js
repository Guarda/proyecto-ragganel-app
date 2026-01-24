const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

// Health check
router.get('/health', (req, res) => {
    res.status(200).json({ message: 'Service is up and running!' });
});

// List all services
router.get('/', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarTablaServiciosBase\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// Create service
router.post('/crear-servicio', (req, res) => {
    const { servicio, insumos } = req.body;

    if (!servicio) {
        return res.status(400).json({ error: "Falta el objeto 'servicio' en el body." });
    }

    const { DescripcionServicio, PrecioBase, Comentario } = servicio;

    const sql = `CALL \`${dbConfig.database}\`.\`IngresarServicioConInsumos\`(?, ?, ?, ?)`;

    Basedatos.query(sql, [
        DescripcionServicio,
        PrecioBase,
        Comentario,
        JSON.stringify(insumos)
    ], (err, result) => {
        if (err) {
            console.error('Error al insertar servicio:', err);
            return res.status(500).send('Error al insertar servicio');
        }
        res.send({ message: 'Servicio agregado correctamente' });
    });
});

// Get specific service
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarTablaServiciosBaseXId\` (?)`;
    Basedatos.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error al buscar el servicio');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Servicio no encontrado');
            return;
        }
        res.json(result[0]);
    });
});

// Get supplies by service id
router.get('/insumos/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarInsumosxServicio\` (?)`;
    Basedatos.query(sql, id, (err, result) => {
        if (err) {
            return res.status(500).send('Error al buscar los insumos del servicio');
        }
        // If no supplies are found, result[0] might be empty. Return an empty array to prevent frontend errors.
        if (!result[0]) {
             return res.json([]);
        }
        res.json(result[0]);
    });
});

// Update Service (CORRECTED ROUTE)
router.put('/actualizar-servicio', (req, res) => {
    // 1. Destructure as sent from the Frontend
    const { servicio, insumos } = req.body;

    if (!servicio) {
        return res.status(400).json({ error: "Service data is missing." });
    }

    // 2. Extract data from the 'servicio' object
    const {
        CodigoServicio,
        DescripcionServicio,
        PrecioBase,
        EstadoServicioFK,
        Comentario
    } = servicio;

    // 3. Update the service header
    Basedatos.query(
        `CALL \`${dbConfig.database}\`.\`ActualizarServicioConInsumos\`(?, ?, ?, ?, ?)`,
        [
            CodigoServicio,
            DescripcionServicio,
            PrecioBase,
            Comentario,
            EstadoServicioFK
        ],
        (err) => {
            if (err) {
                console.error('Error updating base service:', err);
                return res.status(500).json({ error: 'Error al actualizar el servicio base' });
            }

            // 4. Process supplies. If 'insumos' is undefined or null, use an empty array.
            const listaInsumos = insumos || [];
            insertarInsumosRecursivo(0, listaInsumos, CodigoServicio, res);
        }
    );
});

// Recursive Function (CORRECTED: Variable names)
function insertarInsumosRecursivo(index, insumos, CodigoServicio, res) {
    // Base case: Finished iterating through the array
    if (!insumos || index >= insumos.length) {
        return res.status(200).json({ message: 'Servicio actualizado con insumos.' });
    }

    const insumoActual = insumos[index];

    // IMPORTANT: This is where the error was. The frontend sends CodigoInsumoFK and CantidadDescargue
    const codigoInsumo = insumoActual.CodigoInsumoFK;
    const cantidad = insumoActual.CantidadDescargue;

    // Extra validation to avoid sending NULL to the DB
    if (!codigoInsumo || cantidad === undefined || cantidad === null) {
        console.error("Invalid data in supply:", insumoActual);
        // We can skip this corrupt supply and continue, or return an error.
        // Here, we choose to return an error so you notice it.
        return res.status(400).json({ error: `Incomplete data for supply at index ${index}` });
    }

    Basedatos.query(
        `CALL \`${dbConfig.database}\`.\`InsertarOActualizarInsumoXServicio\`(?, ?, ?)`,
        [CodigoServicio, codigoInsumo, cantidad],
        (err) => {
            if (err) {
                console.error('SQL error when inserting supply:', err);
                return res.status(500).json({ error: 'Error al insertar insumo ' + codigoInsumo });
            }

            // Recursive call to the next one
            insertarInsumosRecursivo(index + 1, insumos, CodigoServicio, res);
        }
    );
}

// Delete service
router.delete('/eliminar-servicio/:id', (req, res) => {
    const idServicio = req.params.id;

    Basedatos.query(`CALL \`${dbConfig.database}\`.\`EliminarServicioEInsumos\`(?)`, [idServicio], (error, results) => {
        if (error) {
            console.error('Error al eliminar el servicio:', error);
            return res.status(500).json({ message: 'Error al eliminar el servicio.' });
        }

        res.status(200).json({ message: 'Servicio e insumos eliminados correctamente (soft delete).' });
    });
});

module.exports = router;