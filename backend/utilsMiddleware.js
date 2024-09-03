const db = require('./index')


/* List all console types */


app.get('/listar-categorias', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarCategoriasConsolasBase`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching categorias');
            return;
        }
        //console.log(res.json(results));
        res.json(results[0]);
    });
});

module.exports = listarCategorias

