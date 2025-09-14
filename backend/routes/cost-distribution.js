const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

/**
 * @route   GET /api/cost-distribution/:idPedido
 * @desc    Obtiene los modelos únicos de un pedido y su porcentaje de distribución de costos.
 * @access  Private
 */
router.get('/:idPedido', (req, res) => {
    const { idPedido } = req.params;

    if (!idPedido) {
        return res.status(400).json({ error: 'El ID del pedido es requerido.' });
    }

    const query = `CALL \`${dbConfig.database}\`.\`sp_GetModelosUnicosDePedido\`(?);`;

    Basedatos.query(query, [idPedido], (err, results) => {
        if (err) {
            console.error('Error al ejecutar sp_GetModelosUnicosDePedido:', err);
            return res.status(500).json({ error: 'Error al obtener los modelos del pedido.' });
        }
        res.status(200).json(results[0]);
    });
});

/**
 * @route   POST /api/cost-distribution/
 * @desc    Guarda o actualiza los porcentajes de distribución de costos para una lista de modelos.
 * @access  Private
 */
router.post('/', (req, res) => {
    const distribuciones = req.body; // Se espera un array de objetos: [{ IdModeloFK, TipoArticuloFK, PorcentajeAsignado }, ...]

    if (!Array.isArray(distribuciones) || distribuciones.length === 0) {
        return res.status(400).json({ error: 'Se requiere un array de distribuciones.' });
    }

    const promises = distribuciones.map(dist => {
        return new Promise((resolve, reject) => {
            const query = `CALL \`${dbConfig.database}\`.\`sp_UpsertCostoDistribucion\`(?, ?, ?);`;
            const params = [dist.IdModeloFK, dist.TipoArticuloFK, dist.PorcentajeAsignado];

            Basedatos.query(query, params, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    });

    Promise.all(promises)
        .then(() => res.status(200).json({ message: 'Configuración de costos guardada exitosamente.' }))
        .catch(err => {
            console.error('Error al guardar la configuración de costos:', err);
            res.status(500).json({ error: 'Error al guardar la configuración.' });
        });
});

module.exports = router;