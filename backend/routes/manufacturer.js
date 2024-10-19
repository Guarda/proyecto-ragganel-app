const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List all manufacturers
router.get('/listar-fabricantes', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarFabricantes`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// Delete a category
router.put('/fabricante-eliminar/:id', (req, res) => {
    const id = req.params.id;    
    const sql = 'CALL `base_datos_inventario_taller`.`SoftDeleteFabricante` (?)';
    db.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error al eliminar Fabricante');
            return;
        }
        res.send({ message: 'Fabricante eliminado' });
    });
});

module.exports = router;