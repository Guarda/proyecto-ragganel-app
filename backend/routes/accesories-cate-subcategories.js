const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

// List all active cate
router.get('/listar-cate-accesorio', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarCategoriasAccesorios\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all cate
router.get('/listar-cate-accesorio-b', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarCategoriasAccesoriosB\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }        
        res.json(results[0]);
    });
});

// List all active subcate
router.get('/listar-subcate-accesorio', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarSubCategoriasAccesorios\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// List all cate by manufacturer
router.get('/listar-cate-accesorio/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarCategoriasAccesoriosxFabricante\`(?)`;
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

// List all cate by active model
router.get('/listar-cate-accesorio-b/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarCategoriasAccesoriosxModeloActivo\`(?)`;
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
    const sql = `CALL \`${dbConfig.database}\`.\`ListarInformacionCategoriaAccesorioxId\`(?)`;
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
router.get('/listar-subcate-accesorio/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarSubCategoriasAccesoriossxCategoria\`(?)`;
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
router.get('/listar-subcate-accesorio-b/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarSubCategoriasAccesoriosxCategoriaBase\`(?)`;
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
router.get('/listar-subcate-accesorio-c/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarSubCategoriasAccesoriosxModeloActivo\`(?)`;
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

// Create a new categorie
router.post('/ingresar-categoria-accesorio', (req, res) => {
    const IdFabricante = req.query.IdFabricanteAccesorio;
    const NombreCategoria = req.query.NombreCategoriaAccesorio; 
    
    const sql = `CALL \`${dbConfig.database}\`.\`IngresarCategoriaAccesorioB\`(?, ?)`;
    Basedatos.query(sql, [NombreCategoria, IdFabricante], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Categoria agregada', id: result.insertId });
    });
});


// List cate info by id
router.get('/informacion-subcategoria/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarInformacionSubCategoriaAccesorioxId\`(?)`;
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
router.put('/categoria-eliminar-accesorio/:id', (req, res) => {
    const id = req.params.id;    
    const sql = `CALL \`${dbConfig.database}\`.\`SofDeleteCategoriaAccesorio\`(?)`;
    Basedatos.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error al eliminar Subcategoria');
            return;
        }
        res.send({ message: 'Subategoria eliminada' });
    });
});

// Create a new subcategorie
router.post('/ingresar-subcategoria-accesorio', (req, res) => {
    const IdCategoria = req.query.IdCategoriaAccesorio;
    const NombreSubCategoria = req.query.NombreSubCategoriaAccesorio; 

    const sql = `CALL \`${dbConfig.database}\`.\`IngresarSubcategoriaAccesorio\`(?, ?)`;
    Basedatos.query(sql, [NombreSubCategoria, IdCategoria], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Categoria agregada', id: result.insertId });
    });
});

// Delete a category
router.put('/subcategoria-eliminar-accesorio/:id', (req, res) => {    
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`SofDeleteSubCategoriaAccesorio\`(?)`;
    Basedatos.query(sql, [id], err => {
        if (err) {
            res.status(500).send('Error al eliminar Subcategoria');
            return;
        }
        res.send({ message: 'Subategoria eliminada' });
    });
});

module.exports = router;