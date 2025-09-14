const express = require('express');
const router = express.Router();
// 1. Importamos la configuración centralizada
const { Basedatos, dbConfig } = require('../config/db');

// Get by specific type of product
router.get('/accesorio/:id', (req, res) => {
    const id = req.params.id;
    // 2. Hacemos la consulta dinámica usando la configuración
    const sql = `CALL \`${dbConfig.database}\`.\`ListarAccesoriosXIdTipoProducto\`(?)`;
    
    // 3. Usamos 'Basedatos.query' en lugar de 'db.query'
    Basedatos.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error al buscar la categoria');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Categoria no encontrada');
            return;
        }
        res.json(result[0]);
    });
});

module.exports = router;