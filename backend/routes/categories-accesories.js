const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

// Create a new category
router.post('/crear-categoria-accesorio', (req, res) => {
    console.log(req.params)
    const { FabricanteAccesorio, CateAccesorio, SubCategoriaAccesorio, CodigoModeloAccesorio, LinkImagen} = req.body;
    const sql = `CALL \`${dbConfig.database}\`.\`IngresarCategoriaAccesorio\` (?, ?, ?, ?, ?)`;
    Basedatos.query(sql, [FabricanteAccesorio, CateAccesorio, SubCategoriaAccesorio, CodigoModeloAccesorio, LinkImagen], (err, result) => {
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
    const { IdModeloAccesorioPK, FabricanteAccesorio, CateAccesorio, SubCategoriaAccesorio, CodigoModeloAccesorio, LinkImagen } = req.body;
    const sql = `CALL \`${dbConfig.database}\`.\`ActualizarCategoriaAccesorio\` (?, ?, ?, ?, ?, ?)`;
    const sql2 = `CALL \`${dbConfig.database}\`.\`ListarTablacatalogoaccesoriosXId\` (?)`;
    Basedatos.query(sql, [IdModeloAccesorioPK, FabricanteAccesorio, CateAccesorio, SubCategoriaAccesorio, CodigoModeloAccesorio, LinkImagen ], err => {
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
    const { IdModeloAccesorioPK } = req.body;
    const sql = `CALL \`${dbConfig.database}\`.\`BorrarCategoriaAccesorio\` (?)`;
    Basedatos.query(sql, [IdModeloAccesorioPK], err => {
        if (err) {
            res.status(500).send('Error al eliminar categoria');
            return;
        }
        res.send({ message: 'Categoria eliminada' });
    });
});

module.exports = router;
