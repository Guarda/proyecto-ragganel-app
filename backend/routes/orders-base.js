const express = require('express');
const router = express.Router();
const db = require('../config/db');

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
    const sql = 'CALL IngresarPedidoATablaPedidos(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [
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

// List all products
router.get('/', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarTablaPedidosBase`();', (err, results) => {
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
    const sql = 'CALL `base_datos_inventario_taller`.`ListarTablaPedidosBasesXId` (?)';
    db.query(sql, id, (err, result) => {
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
    const sql = 'CALL `base_datos_inventario_taller`.`ListarArticulosXIdPedido` (?)';
    db.query(sql, id, (err, result) => {
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

module.exports = router;