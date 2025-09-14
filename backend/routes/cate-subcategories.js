const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

// List all active cate
router.get('/listar-cate', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarCategoriasProductos\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all cate
router.get('/listar-cate-b', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarCategoriasProductosBase\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }        
        res.json(results[0]);
    });
});

// List all cate by manufacturer
router.get('/listar-cate/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarCategoriasProductosxFabricante\` (?)`;
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

// List all cate with an active model
router.get('/listar-cate-b/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarCategoriasProductosxModeloActivo\` (?)`;
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

// List cate info by id
router.get('/informacion-categoria/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarInformacionCategoriaxId\` (?)`;
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



// List all active subcate
router.get('/listar-subcate', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarSubCategoriasProductos\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});


// List all subcate by cate
router.get('/listar-subcate/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarSubCategoriasProductosxCategoria\` (?)`;
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

// List all subcate by cate
router.get('/listar-subcate-b/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarSubCategoriasProductosxCategoriaBase\` (?)`;
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

// List all subcate with an active model
router.get('/listar-subcate-c/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarSubCategoriasProductosxModeloActivo\` (?)`;
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

// List cate info by id
router.get('/informacion-subcategoria/:id', (req, res) => {
    const id = req.params.id;
    // console.log(id);
    const sql = `CALL \`${dbConfig.database}\`.\`ListarInformacionSubCategoriaxId\` (?)`;
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

// Delete a category
router.put('/categoria-eliminar/:id', (req, res) => {
    const id = req.params.id;    
    const sql = `CALL \`${dbConfig.database}\`.\`SofDeleteCategoria\` (?)`;
    Basedatos.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error al eliminar Categoria');
            return;
        }
        res.send({ message: 'Categoria eliminada' });
    });
});

// Create a new categorie
router.post('/ingresar-categoria', (req, res) => {
    const IdFabricante = req.query.IdFabricante;
    // Convert RealizadoValue to a number (0 or 1)
    const NombreCategoria = req.query.NombreCategoria; 
    //console.log(req.body);

    const sql = `CALL \`${dbConfig.database}\`.\`IngresarCategoria\` (?, ?)`;
    Basedatos.query(sql, [NombreCategoria, IdFabricante ], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Categoria agregada', id: result.insertId });
    });
});

// Create a new subcategorie
router.post('/ingresar-subcategoria', (req, res) => {
    const IdCategoria = req.query.IdCategoria;
    // Convert RealizadoValue to a number (0 or 1)
    const NombreSubCategoria = req.query.NombreSubCategoria; 
    //console.log(req.body);

    const sql = `CALL \`${dbConfig.database}\`.\`IngresarSubcategoria\` (?, ?)`;
    Basedatos.query(sql, [NombreSubCategoria, IdCategoria ], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Categoria agregada', id: result.insertId });
    });
});

// Delete a category
router.put('/subcategoria-eliminar/:id', (req, res) => {
    const id = req.params.id;    
    const sql = `CALL \`${dbConfig.database}\`.\`SofDeleteSubCategoria\` (?)`;
    Basedatos.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error al eliminar Subcategoria');
            return;
        }
        res.send({ message: 'Subategoria eliminada' });
    });
});

module.exports = router;