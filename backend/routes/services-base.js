const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Example endpoint: Health check
router.get('/health', (req, res) => {
    res.status(200).json({ message: 'Service is up and running!' });
});

// List all products
router.get('/', (req, res) => {
    db.query('CALL `base_datos_inventario_taller`.`ListarTablaServiciosBase`();', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching posts');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

router.post('/crear-servicio', (req, res) => {
    const { servicio, insumos } = req.body;

    if (!servicio) {
        return res.status(400).json({ error: "Falta el objeto 'servicio' en el body." });
    }

    const { DescripcionServicio, PrecioBase, Comentario } = servicio;

    const sql = 'CALL IngresarServicioConInsumos(?, ?, ?, ?)';

    db.query(sql, [
        DescripcionServicio,
        PrecioBase,
        Comentario,
        JSON.stringify(insumos) // Puede ser array vacío
    ], (err, result) => {
        if (err) {
            console.error('Error al insertar servicio:', err);
            return res.status(500).send('Error al insertar servicio');
        }
        //es.status(200).json({ message: 'Servicio e insumos eliminados correctamente (soft delete).' });
        res.send({ message: 'Servicio agregado correctamente' });
    });
});

// Get a specific active service
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarTablaServiciosBaseXId` (?)';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error al buscar el servicio');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Servicio no encontrado');
            return;
        }
        res.json(result[0]);
    });
});

//get supplies by service id
router.get('/insumos/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'CALL `base_datos_inventario_taller`.`ListarInsumosxServicio` (?)';
    db.query(sql, id, (err, result) => {
        if (err) {
            res.status(500).send('Error al buscar los insumos del servicio');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('Insumos no encontrados');
            return;
        }
        res.json(result[0]);
    });
});

router.put('/actualizar-servicio', (req, res) => {
  const {
    CodigoServicio,
    DescripcionServicio,
    PrecioBase,
    EstadoServicioFK,
    Comentario,
    InsumosAgregados
  } = req.body;
  console.log(req.body);
  // 1. Llamar al primer procedimiento
  db.query(
    'CALL ActualizarServicioConInsumos(?, ?, ?, ?, ?)',
    [
      CodigoServicio,
      DescripcionServicio,
      PrecioBase,
      Comentario,
      //new Date(Fecha_Ingreso), // O convierte según tu formato
      EstadoServicioFK
    ],
    (err) => {
      if (err) {
        console.error('Error al actualizar el servicio:', err);
        return res.status(500).json({ error: 'Error al actualizar el servicio base' });
      }

      // 2. Procesar los insumos uno por uno (de forma secuencial para evitar sobrecarga)
      insertarInsumosRecursivo(0, InsumosAgregados, CodigoServicio, res);
    }
  );
});

function insertarInsumosRecursivo(index, insumos, CodigoServicio, res) {
  if (index >= insumos.length) {
    // Cuando termina
    return res.status(200).json({ message: 'Servicio actualizado con insumos.' });
  }

  const insumo = insumos[index];

  db.query(
    'CALL InsertarOActualizarInsumoXServicio(?, ?, ?)',
    [CodigoServicio, insumo.Codigo, insumo.Cantidad],
    (err) => {
      if (err) {
        console.error('Error al insertar insumo:', err);
        return res.status(500).json({ error: 'Error al insertar insumo ' + insumo.Codigo });
      }

      // Llamar al siguiente
      insertarInsumosRecursivo(index + 1, insumos, CodigoServicio, res);
    }
  );
}

// Endpoint DELETE (soft delete)
router.delete('/eliminar-servicio/:id', (req, res) => {
    const idServicio = req.params.id;

    db.query('CALL EliminarServicioEInsumos(?)', [idServicio], (error, results) => {
        if (error) {
            console.error('Error al eliminar el servicio:', error);
            return res.status(500).json({ message: 'Error al eliminar el servicio.' });
        }

        res.status(200).json({ message: 'Servicio e insumos eliminados correctamente (soft delete).' });
    });
});


// Add your endpoints here

module.exports = router;