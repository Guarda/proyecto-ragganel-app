const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a new category
router.post('/crear-categoria-insumos', (req, res) => {
    console.log(req.body)
    const { FabricanteInsumo, CategoriaInsumo, SubCategoriaInsumo, CodigoModeloInsumo, LinkImagen} = req.body;
    const sql = 'CALL `base_datos_inventario_taller`.`IngresarCategoriaInsumo` (?, ?, ?, ?, ?)';
    db.query(sql, [FabricanteInsumo, CategoriaInsumo, SubCategoriaInsumo, CodigoModeloInsumo, LinkImagen], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Categoria agregada', id: result.insertId });
    });
});

// Update a category
router.put('/categoria/:id', (req, res) => {
    const id = req.params.id;
    // console.log(req.body);
    const { IdModeloInsumosPK, FabricanteInsumo, CategoriaInsumo, SubCategoriaInsumo, CodigoModeloInsumo, LinkImagen } = req.body;
    const sql = 'CALL `base_datos_inventario_taller`.`ActualizarCategoriaInsumo` (?, ?, ?, ?, ?, ?)';
    const sql2 = 'CALL `base_datos_inventario_taller`.`ListarTablacatalogoinsumosXId` (?)';
    db.query(sql, [IdModeloInsumosPK, FabricanteInsumo, CategoriaInsumo, SubCategoriaInsumo, CodigoModeloInsumo, LinkImagen ], err => {
        if (err) {
            res.status(500).send('Error actualizando categoria');
            return;
        }
        db.query(sql2, id, (err, result) => {
            if (err) {
                res.status(500).send('Error al buscar categoria actualizada');
                return;
            }
            res.json(result[0]);
        });
    });
});

// Delete a category
router.put('/categoria-eliminar/:id', (req, res) => {
    const id = req.params.id;
    const { IdModeloAccesorioPK } = req.body;
    const sql = 'CALL `base_datos_inventario_taller`.`BorrarCategoriaAccesorio` (?)';
    db.query(sql, [IdModeloAccesorioPK], err => {
        if (err) {
            res.status(500).send('Error al eliminar categoria');
            return;
        }
        res.send({ message: 'Categoria eliminada' });
    });
});

module.exports = router;