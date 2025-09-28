const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

const fs = require('fs');
const path = require('path');

//create a new order
router.post('/crear-pedido', (req, res) => {
    const {
        Comentarios,
        FechaArrivoUSA,
        FechaCreacionPedido,
        FechaEstimadaRecepcion,
        Impuestos,
        NumeroTracking1,
        NumeroTracking2,
        PesoPedido,
        ShippingUSA,
        ShippingNic,
        SitioWeb,
        SubTotalArticulos,
        ViaPedido,
        PrecioEstimadoDelPedido,
        articulos
    } = req.body;

    console.log(req.body)

    // Asegúrate de que los valores enviados sean los correctos
    const sql = `CALL \`${dbConfig.database}\`.\`IngresarPedidoATablaPedidos\`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    Basedatos.query(sql, [
        FechaCreacionPedido,
        FechaArrivoUSA,
        FechaEstimadaRecepcion,  // Asegúrate de que se pase correctamente
        NumeroTracking1,
        NumeroTracking2,
        SitioWeb,
        ViaPedido,
        PesoPedido,
        Comentarios,
        Impuestos,
        ShippingUSA,
        ShippingNic,
        SubTotalArticulos,
        PrecioEstimadoDelPedido,
        JSON.stringify(articulos)  // Artículos debe ser un JSON stringificado
    ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.send({ message: 'Pedido agregado correctamente' });
    });
});

/**
 * @route   GET /imagenes-existentes-productos
 * @desc    Devuelve una lista de los nombres de archivo de las imágenes en la carpeta public/img-consolas
 * @access  Public
 */
router.get('/imagenes-existentes-productos', (req, res) => {
    // Construimos la ruta absoluta al directorio de imágenes de productos (consolas)
    const directoryPath = path.join(__dirname, '..', 'public', 'img-consolas');
  
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        // Si la carpeta no existe, devolvemos un array vacío en lugar de un error 500
        if (err.code === 'ENOENT') {
          console.warn(`Directorio no encontrado: ${directoryPath}. Devolviendo lista vacía.`);
          return res.json([]);
        }
        console.error('No se pudo escanear el directorio: ', err);
        return res.status(500).send('Error al leer el directorio de imágenes de productos.');
      }
      
      // Filtramos para devolver solo archivos de imagen comunes
      const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
      
      res.json(imageFiles);
    });
  });

// List all products
router.get('/', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarTablaPedidosBase\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

// Get a specific product
router.get('/listar/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarTablaPedidosBasesXId\` (?)`;
    Basedatos.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error al buscar pedido');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Pedido no encontrado');
            return;
        }
        res.json(result[0]);
    });
});

// Get Order article list 
router.get('/listar-articulos/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarArticulosXIdPedido\` (?)`;
    Basedatos.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error al buscar pedido');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Pedido no encontrado');
            return;
        }
        res.json(result[0]);
    });
});

/**
 * @route   GET /pedidos/reporte-ingreso/:id
 * @desc    Obtiene los datos de los códigos generados para un pedido ya ingresado.
 * @access  Private
 */
router.get('/reporte-ingreso/:id', (req, res) => {
    const idPedido = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`sp_ObtenerCodigosDePedido\`(?)`;

    Basedatos.query(sql, [idPedido], (err, results) => {
        if (err) {
            console.error('Error al ejecutar sp_ObtenerCodigosDePedido:', err);
            return res.status(500).json({ error: 'Error al generar el reporte del pedido.' });
        }
        // El SP devuelve una estructura que el frontend ya sabe cómo manejar.
        // results[0] contendrá el array con el objeto: [ { Resultado: '...' } ]
        res.status(200).json(results[0]);
    });
});

router.put('/actualizar-pedido/:id', (req, res) => {
    const {
        CodigoPedido, // Se asume que se envía el ID del pedido
        Comentarios,
        FechaArriboUSA,
        FechaCreacionPedido,
        FechaEstimadaRecepcion,
        Impuestos,
        NumeroTracking1,
        NumeroTracking2,
        PesoPedido,
        PrecioEstimadoDelPedido,
        ShippingNic,
        ShippingUSA,
        SitioWeb,
        SubTotalArticulos,
        ViaPedido,
        Estado,
        // Se añade la variable para los artículos
        articulos 
    } = req.body;

    // console.log(req.body)
    // Llamar al procedimiento almacenado para actualizar los datos generales del pedido
    const sql = `CALL \`${dbConfig.database}\`.\`ActualizarDatosGeneralesPedido\`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    Basedatos.query(sql, [
        CodigoPedido,
        FechaCreacionPedido,
        FechaArriboUSA,
        FechaEstimadaRecepcion,
        NumeroTracking1,
        NumeroTracking2,
        SitioWeb,
        ViaPedido,
        PesoPedido,
        Comentarios,
        Impuestos,
        ShippingUSA,
        ShippingNic,
        SubTotalArticulos,
        PrecioEstimadoDelPedido,
        Estado
    ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al actualizar el pedido');
        }

        // Si no hay artículos, la operación termina aquí con éxito.
        if (!articulos || !Array.isArray(articulos) || articulos.length === 0) {
            return res.status(200).json({ message: 'Datos del pedido actualizados, no se procesaron artículos.' });
        }

        // Lógica para procesar los artículos
        const articulosParaActualizar = [];
        const articulosParaAgregar = [];

        articulos.forEach(articulo => {
            articulo.IdCodigoPedidoFK = articulo.IdCodigoPedidoFK || CodigoPedido;
            if (articulo.IdPedidoDetallePK) {
                articulosParaActualizar.push(articulo);
            } else {
                articulosParaAgregar.push(articulo);
            }
        });

        const updatePromises = articulosParaActualizar.map(articulo => {
            return new Promise((resolve, reject) => {
                const updateQuery = `CALL \`${dbConfig.database}\`.\`ActualizarArticuloPedido\`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                Basedatos.query(updateQuery, [
                    articulo.IdPedidoDetallePK,
                    articulo.IdCodigoPedidoFK,
                    articulo.TipoArticuloFK,
                    articulo.FabricanteArticulo,
                    articulo.CategoriaArticulo,
                    articulo.SubcategoriaArticulo,
                    articulo.Cantidad,
                    articulo.EnlaceCompra,
                    articulo.Precio,
                    articulo.IdModeloPK,
                    articulo.EstadoArticuloPedido,
                    articulo.Activo
                ], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        });

        const insertPromises = articulosParaAgregar.map(articulo => {
            return new Promise((resolve, reject) => {
                const insertQuery = `CALL \`${dbConfig.database}\`.\`InsertarArticuloPedido\`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                Basedatos.query(insertQuery, [
                    articulo.IdCodigoPedidoFK || CodigoPedido,
                    articulo.TipoArticulo,
                    articulo.Fabricante,
                    articulo.Cate,
                    articulo.SubCategoria,
                    articulo.Cantidad,
                    articulo.EnlaceCompra,
                    articulo.Precio,
                    articulo.IdModeloPK,
                    articulo.Activo
                ], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        });

        Promise.all([...updatePromises, ...insertPromises])
            .then(() => {
                res.status(200).json({ message: 'Datos del pedido y artículos actualizados correctamente' });
            })
            .catch(err => {
                console.error("Error al procesar artículos:", err);
                res.status(500).json({ error: 'Error al procesar los artículos', detalles: err.message });
            });
    });
});

router.post('/actualizar-o-agregar-articulos', (req, res) => {
    const { CodigoPedido, articulos } = req.body;

    if (!CodigoPedido || !Array.isArray(articulos) || articulos.length === 0) {
        return res.status(400).send('Se requiere CodigoPedido y una lista de artículos.');
    }

    const articulosParaActualizar = [];
    const articulosParaAgregar = [];

    articulos.forEach(articulo => {
        // Asignar CodigoPedido si no está presente
        articulo.IdCodigoPedidoFK = articulo.IdCodigoPedidoFK || CodigoPedido;

        // Validar si todos los campos requeridos están presentes antes de procesar
        // if (!articulo.TipoArticuloFK || !articulo.FabricanteArticulo || !articulo.CategoriaArticulo ||
        //     !articulo.SubcategoriaArticulo || !articulo.Cantidad || !articulo.EnlaceCompra ||
        //     !articulo.Precio || !articulo.IdModeloPK) {
        //     console.error("Artículo con datos incompletos:", articulo);
        //     return;
        // }

        if (articulo.IdPedidoDetallePK) {
            articulosParaActualizar.push(articulo);
        } else {
            articulosParaAgregar.push(articulo);
        }
    });

    if (articulosParaActualizar.length === 0 && articulosParaAgregar.length === 0) {
        return res.status(400).send('No hay artículos válidos para procesar.');
    }

    const updatePromises = articulosParaActualizar.map(articulo => {
        return new Promise((resolve, reject) => {
            const updateQuery = `CALL \`${dbConfig.database}\`.\`ActualizarArticuloPedido\`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            Basedatos.query(updateQuery, [
                articulo.IdPedidoDetallePK,
                articulo.IdCodigoPedidoFK,
                articulo.TipoArticuloFK,
                articulo.FabricanteArticulo,
                articulo.CategoriaArticulo,
                articulo.SubcategoriaArticulo,
                articulo.Cantidad,
                articulo.EnlaceCompra,
                articulo.Precio,
                articulo.IdModeloPK,
                articulo.EstadoArticuloPedido,
                articulo.Activo
            ], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    });

    const insertPromises = articulosParaAgregar.map(articulo => {
        return new Promise((resolve, reject) => {
            const insertQuery = `CALL \`${dbConfig.database}\`.\`InsertarArticuloPedido\`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            Basedatos.query(insertQuery, [
                articulo.IdCodigoPedidoFK,
                articulo.TipoArticulo,
                articulo.Fabricante,
                articulo.Cate,
                articulo.SubCategoria,
                articulo.Cantidad,
                articulo.EnlaceCompra,
                articulo.Precio,
                articulo.IdModeloPK,
                articulo.Activo
            ], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    });

    Promise.all([...updatePromises, ...insertPromises])
        .then(() => {
            res.status(200).json({ mensaje: 'Artículos procesados correctamente' });
        })
        .catch(err => {
            console.error("Error al procesar artículos:", err);
            res.status(500).json({ error: 'Error al procesar los artículos', detalles: err.message });
        });


});

// // Endpoint para ingresar inventario
// router.post('/ingresar-inventario/', (req, res) => {
//     const { idPedido, productos, accesorios, insumos } = req.body;
//     console.log("Recibido en servidor:", { idPedido, productos, accesorios, insumos });

//     // Llamada al procedimiento almacenado
//     const query = 'CALL IngresarArticulosPedido(?, ?, ?)';

//     // En tu lógica de inserción en el servidor, puedes verificar antes de enviar los datos
//     productos.forEach((producto) => {
//         // Asegúrate de que CodigoConsola tenga un valor válido, si no, asigna un valor predeterminado
//         if (!producto.CodigoConsola) {
//             producto.CodigoConsola = 'Sin código'; // Asignar un valor predeterminado
//         }
//     });


//     // Convertir los objetos a JSON.stringify para pasarlos como cadenas a MySQL
//     db.query(query, [idPedido, JSON.stringify(productos), JSON.stringify(accesorios)], (err, results) => {
//         if (err) {
//             console.error('Error al ejecutar el procedimiento: ', err);
//             return res.status(500).send({ error: 'Error al ejecutar el procedimiento almacenado.' });
//         }

//         // Si la consulta es exitosa, podemos devolver los códigos generados
//         const codigosGenerados = results[0][0].CodigosIngresados;  // Acceder a los resultados

//         // Enviar la respuesta con los códigos generados
//         res.status(200).send({
//             mensaje: 'Inventario ingresado correctamente',
//             codigosGenerados
//         });
//     });
// });
// Endpoint para ingresar inventario
router.post('/ingresar-inventario/', (req, res) => {
    const { idPedido, productos, accesorios, insumos } = req.body;
    console.log("Recibido en servidor:", { idPedido, productos, accesorios, insumos });

    // Se procesan los arrays para convertir sub-arrays (como listas de tareas) en strings.
    productos.forEach((producto) => {
        if (Array.isArray(producto.TodoList)) { producto.TodoList = producto.TodoList.join(','); }
        if (Array.isArray(producto.Accesorios)) { producto.Accesorios = producto.Accesorios.join(','); }
    });
    accesorios.forEach((accesorio) => {
        if (Array.isArray(accesorio.TodoList)) { accesorio.TodoList = accesorio.TodoList.join(','); }
        if (Array.isArray(accesorio.ProductosCompatibles)) { accesorio.ProductosCompatibles = accesorio.ProductosCompatibles.join(','); }
    });
    // Los insumos no tienen arrays que necesiten ser convertidos.

    // Llamada al procedimiento almacenado
    const query = `CALL \`${dbConfig.database}\`.\`IngresarArticulosPedidov3\`(?, ?, ?, ?)`;

    // Convertir los objetos a JSON.stringify para pasarlos como cadenas a MySQL
    Basedatos.query(query, [idPedido, JSON.stringify(productos), JSON.stringify(accesorios), JSON.stringify(insumos)], (err, results) => {
        if (err) {
            console.error('Error al ejecutar el procedimiento: ', err);
            return res.status(500).send({ error: 'Error al ejecutar el procedimiento almacenado.' });
        }

        // ✅ ¡CORRECCIÓN! Envía el resultado DIRECTO del procedimiento almacenado.
        // results[0] contendrá el array con el objeto: [ { Resultado: '...' } ]
        res.status(200).json(results[0]);
    });
});


// Endpoint para cancelar un pedido
router.put('/cancelar-pedido/:id', (req, res) => {
    const idpedido = req.params.id;

    const sql = `CALL \`${dbConfig.database}\`.\`CancelarPedido\`(?)`;

    Basedatos.query(sql, [idpedido], (err, results) => {
        if (err) {
            console.error('Error al cancelar el pedido:', err);
            return res.status(500).json({ mensaje: 'Error al cancelar el pedido' });
        }
        res.status(200).json({ mensaje: 'Pedido cancelado correctamente' });
    });
});

// Endpoint para eliminar un pedido
router.put('/eliminar-pedido/:id', (req, res) => {
    const idpedido = req.params.id;

    const sql = `CALL \`${dbConfig.database}\`.\`EliminarPedido\`(?)`;

    Basedatos.query(sql, [idpedido], (err, results) => {
        if (err) {
            console.error('Error al eliminar el pedido:', err);
            return res.status(500).json({ mensaje: 'Error al eliminar el pedido' });
        }
        res.status(200).json({ mensaje: 'Pedido eliminado correctamente' });
    });
});

// Endpoint para avanzar un pedido
router.put('/avanzar-pedido/:id', (req, res) => {
    const idpedido = req.params.id;

    const sql = `CALL \`${dbConfig.database}\`.\`AvanzarEstadoPedido\`(?)`;

    Basedatos.query(sql, [idpedido], (err, results) => {
        if (err) {
            console.error('Error al avanzar el pedido:', err);
            return res.status(500).json({ mensaje: 'Error al avanzar el pedido' });
        }
        res.status(200).json({ mensaje: 'Pedido avanzado correctamente' });
    });
});


// Get Order article list 
router.get('/historial-pedido/:id', (req, res) => {
    const id = req.params.id;
    const sql = `CALL \`${dbConfig.database}\`.\`ListarHistorialEstadoPedidoXId\` (?)`;
    Basedatos.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener historial:", err);
            return res.status(500).json({ error: "Error en el servidor" });
        }
        res.json(results[0]); // Devuelve el primer conjunto de resultados
    });
});


module.exports = router;