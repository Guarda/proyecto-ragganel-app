const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Asegúrate que la ruta al archivo de conexión de BD sea correcta


const queryAsync = (sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      // Los procedimientos almacenados devuelven los resultados en la posición [0]
      resolve(results[0]);
    });
  });
};

router.get('/', async (req, res) => {
    try {
        const [
            kpis,
            ventas30Dias,
            topArticulos,
            ventasVendedor,
            ultimasVentas,
            stockBajo,
            valorInventarioABC
        ] = await Promise.all([
            queryAsync('CALL sp_Dashboard_KPIs()'),
            queryAsync('CALL sp_Dashboard_VentasUltimos30Dias()'),
            queryAsync('CALL sp_Dashboard_Top5ArticulosVendidos()'),
            queryAsync('CALL sp_Dashboard_VentasPorVendedor()'),
            queryAsync('CALL sp_Dashboard_Ultimas5Ventas()'),
            queryAsync('CALL sp_Dashboard_AlertasStockBajo()'),
            queryAsync('CALL sp_Dashboard_ValorInventarioABC()')
        ]);

        res.status(200).json({
            success: true,
            data: {
                kpis: kpis[0], // KPIs devuelve una sola fila, por eso accedemos a la primera
                ventas30Dias,
                topArticulos,
                ventasVendedor,
                ultimasVentas,
                stockBajo,
                valorInventarioABC
            }
        });

    } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor.' });
    }
});

module.exports = router;