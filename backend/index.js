const express = require('express');
const bodyParser = require('body-parser');
// const mysql = require('mysql');
const db = require('./db')
const cors = require('cors');

const app = express();
const port = 3000;

// const utilMiddleware = require('./utilsMiddleware')



/* MySQL Connection */

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: 'base_datos_inventario_taller'

// });



/* Connect to MySQL */

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});



/* Middleware */

app.use(bodyParser.json());
app.use(cors());
// app.use(utilMiddleware);



/* Routes */

/* List all posts */

app.get('/productos', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarTablaProductosBases`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            return;
        }
        res.json(results[0]);
    });
});

/* List all categories */

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

/* List all console states */
app.get('/listar-estados', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarEstadosConsolas`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching estados');
            return;
        }
        //console.log(res.json(results));
        res.json(results[0]);
    });
})


/* Create a new post */

app.post('/crear-producto', (req, res) => {
    const { IdModeloConsolaPK, ColorConsola, EstadoConsola, HackConsola, ComentarioConsola } = req.body;
    const sql = 'CALL `base_datos_inventario_taller`.`IngresarProductoATablaProductoBase` (?, ?, ?, ?, ?)';
    // console.log(req.body);
    db.query(sql, [IdModeloConsolaPK, ColorConsola, EstadoConsola, HackConsola, ComentarioConsola], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Producto agregado', id: result.insertId });
    });
});
//     const postId = result.insertId;
//     db.query('SELECT * FROM posts WHERE id = ?', postId, (err, result) => {
//       if (err) {
//         res.status(500).send('Error fetching created post');
//         return;
//       }
//       res.status(201).json(result[0]);
//     });
//   });




/* Get a specific post */

app.get('/producto/:id', (req, res) => {
    const id = req.params.id;
    // console.log(id);
    const sql = 'CALL `base_datos_inventario_taller`.`ListarTablaProductosBasesXId` (?)';

    db.query(sql, id, (err, result) => {
        // console.log(sql + id);
        if (err) {
            res.status(500).send('Error al buscar producto');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Producto no encontrado');
            return;
        }
        res.json(result[0]);
        // console.log(result[0]);
    });
});



// /* Update a post */
app.put('/producto/:id', (req, res) => {
  const id = req.params.id;
  const {CodigoConsola, IdModeloConsolaPK, ColorConsola, EstadoConsola, HackConsola, ComentarioConsola } = req.body;

  const sql = 'CALL `base_datos_inventario_taller`.`ActualizarProductoBase` (?, ?, ?, ?, ?, ?)';
  const sql2 = 'CALL `base_datos_inventario_taller`.`ListarTablaProductosBasesXId` (?)';

  db.query(sql, [CodigoConsola, IdModeloConsolaPK, ColorConsola, EstadoConsola, HackConsola, ComentarioConsola], err => {
    if (err) {
      res.status(500).send('Error actualizando producto');
      return;
    }
    db.query(sql2, id, (err, result) => {
      if (err) {
        res.status(500).send('Error al buscar producto actualizado');
        return;
      }
      res.json(result[0]);
    });
  });
});

/* Delete a product */

app.put('/producto-eliminar/:id', (req, res) => {
    const id = req.params.id;
    const {CodigoConsola} = req.body;

    const sql = 'CALL `base_datos_inventario_taller`.`BorrarProducto` (?)';
  
    db.query(sql, [CodigoConsola],  err => {
      if (err) {
        res.status(500).send('Error actualizando producto');
        return;
      }      
    });
  });




/*CATEGORIAS DE PRODUCTOS CONSOLAS*/

/* CREAR CATEGORIA */
/* Create a new post */

app.post('/crear-categoria-producto', (req, res) => {
    const { CodigoModeloConsola, DescripcionConsola, Fabricante, LinkImagen } = req.body;
    const sql = 'CALL `base_datos_inventario_taller`.`IngresarCategoriaProducto` (?, ?, ?, ?)';
    // console.log(req.body);
    db.query(sql, [CodigoModeloConsola, DescripcionConsola, Fabricante, LinkImagen], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({ message: 'Categoria agregada', id: result.insertId });
    });
});


/* Get a specific post */

app.get('/categoria/:id', (req, res) => {
    const id = req.params.id;
    // console.log(id);
    const sql = 'CALL `base_datos_inventario_taller`.`ListarTablacatalogoconsolasXId` (?)';

    db.query(sql, id, (err, result) => {
        // console.log(sql + id);
        if (err) {
            res.status(500).send('Error al buscar la categoria');
            return;
        }

        if (result.length === 0) {
            res.status(404).send('Categoria no encontrada');
            return;
        }
        res.json(result[0]);
        // console.log(result[0]);
    });
});


// /* Update a categoria */
app.put('/categoria/:id', (req, res) => {
    const id = req.params.id;
    const {IdModeloConsolaPK, CodigoModeloConsola, DescripcionConsola, Fabricante, LinkImagen} = req.body;
    console.log('reached');
    const sql = 'CALL `base_datos_inventario_taller`.`ActualizarCategoria` (?, ?, ?, ?, ?)';
    const sql2 = 'CALL `base_datos_inventario_taller`.`ListarTablacatalogoconsolasXId` (?)';
  
    db.query(sql, [IdModeloConsolaPK, CodigoModeloConsola, DescripcionConsola, Fabricante, LinkImagen], err => {
      if (err) {
        res.status(500).send('Error actualizando producto');
        return;
      }
      db.query(sql2, id, (err, result) => {
        if (err) {
          res.status(500).send('Error al buscar producto actualizado');
          return;
        }
        res.json(result[0]);
      });
    });
  });

  /* Delete a category */

app.put('/categoria-eliminar/:id', (req, res) => {
    const id = req.params.id;
    const {IdModeloConsolaPK} = req.body;

    const sql = 'CALL `base_datos_inventario_taller`.`BorrarCategoria` (?)';
  
    db.query(sql, [IdModeloConsolaPK],  err => {
      if (err) {
        res.status(500).send('Error actualizando categoria');
        return;
      }      
    });
  });

// /* Delete a post */
// app.delete('/posts/:id', (req, res) => {
//   const postId = req.params.id;
//   db.query('DELETE FROM posts WHERE id = ?', postId, err => {
//     if (err) {
//       res.status(500).send('Error deleting post');
//       return;
//     }
//     res.status(200).json({ msg: 'Post deleted successfully' });
//   });
// });



/* Start server */

app.listen(port, () => {

    console.log(`Server running on port ${port}`);

});