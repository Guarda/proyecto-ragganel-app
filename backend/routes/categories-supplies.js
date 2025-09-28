const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

// Create a new category
router.post('/crear-categoria-insumos', (req, res) => {
    console.log(req.body)
    const { FabricanteInsumo, CategoriaInsumo, SubCategoriaInsumo, CodigoModeloInsumo, LinkImagen } = req.body;
    const sql = `CALL \`${dbConfig.database}\`.\`IngresarCategoriaInsumo\` (?, ?, ?, ?, ?)`;
    Basedatos.query(sql, [FabricanteInsumo, CategoriaInsumo, SubCategoriaInsumo, CodigoModeloInsumo, LinkImagen], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Categoria agregada', id: result.insertId });
    });
});

// Update a category
router.put('/categoria/:id', (req, res) => {
    const id = req.params.id;
    
    // --- CORRECCIÓN ---
    // Se ajustan los nombres de las variables para que coincidan con el payload del frontend (plural).
    const { 
        IdModeloInsumosPK, 
        FabricanteInsumos, 
        CategoriaInsumos, 
        SubcategoriaInsumos, 
        CodigoModeloInsumos, 
        LinkImagen 
    } = req.body;

    const sql = `CALL \`${dbConfig.database}\`.\`ActualizarCategoriaInsumo\` (?, ?, ?, ?, ?, ?)`;
    const sql2 = `CALL \`${dbConfig.database}\`.\`ListarTablacatalogoinsumosXId\` (?)`;
    Basedatos.query(sql, [IdModeloInsumosPK, FabricanteInsumos, CategoriaInsumos, SubcategoriaInsumos, CodigoModeloInsumos, LinkImagen ], err => {
        if (err) {
            res.status(500).send('Error actualizando categoria');
            return;
        }
        Basedatos.query(sql2, id, (err, result) => {
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
    const { IdModeloInsumoPK } = req.body;
    const sql = `CALL \`${dbConfig.database}\`.\`BorrarCategoriaInsumo\` (?)`;
    Basedatos.query(sql, [IdModeloInsumoPK], err => {
        if (err) {
            res.status(500).send('Error al eliminar categoria');
            return;
        }
        res.send({ message: 'Categoria eliminada' });
    });
});

module.exports = router;