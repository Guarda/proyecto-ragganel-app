const db = require('./index')


/* List all console types */

function listarCategorias() {
    app.get('/listar-categorias', (req, res) => {
        db.query('CALL `base_datos_inventario_taller`.`ListarCategoriasConsolasBase`();', (err, results) => {
            if (err) {
                res.status(500).send('Error fetching posts');
                return;
            }
            console.log(res.json(results));
            res.json(results);
        });
    });
}

module.exports = listarCategorias

