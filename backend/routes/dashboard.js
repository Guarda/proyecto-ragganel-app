const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db'); // Asegúrate que la ruta al archivo de conexión de BD sea correcta


// ===================================================================
// FUNCIÓN queryAsync MEJORADA (AHORA ACEPTA PARÁMETROS)
// ===================================================================
const queryAsync = (sql, params = []) => { // <-- Acepta un array de parámetros
  return new Promise((resolve, reject) => {
    // Pasa los parámetros a la consulta de forma segura
    Basedatos.query(sql, params, (err, results) => { 
      if (err) return reject(err);

      // La llamada a un SP devuelve los resultados en la posición [0]
      // Verificamos si es un SP (suele devolver un array de arrays)
      if (Array.isArray(results) && results.length > 0 && Array.isArray(results[0])) {
          resolve(results[0]); // Es un SP, devolvemos el primer set de resultados
      } else {
          resolve(results); // Es una query simple o está vacío
      }
    });
  });
};

// ===================================================================
// RUTA PRINCIPAL (KPIs, Listas, etc. - SIN EL GRÁFICO)
// ===================================================================
router.get('/', async (req, res) => {
    try {
        const [
            kpis,
            topArticulos,
            ventasVendedor,
            ultimasVentas,
            stockBajo,
            valorInventarioABC
        ] = await Promise.all([
            queryAsync(`CALL \`${dbConfig.database}\`.\`sp_Dashboard_KPIs\`()`),
            queryAsync(`CALL \`${dbConfig.database}\`.\`sp_Dashboard_Top5ArticulosVendidos\`()`),
            queryAsync(`CALL \`${dbConfig.database}\`.\`sp_Dashboard_VentasPorVendedor\`()`),
            queryAsync(`CALL \`${dbConfig.database}\`.\`sp_Dashboard_Ultimas5Ventas\`()`),
            queryAsync(`CALL \`${dbConfig.database}\`.\`sp_Dashboard_AlertasStockBajo\`()`),
            queryAsync(`CALL \`${dbConfig.database}\`.\`sp_Dashboard_ValorInventarioABC\`()`)
        ]);

        res.status(200).json({
            success: true,
            data: {
                kpis: kpis[0], // KPIs devuelve una sola fila
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

// ===================================================================
// NUEVA RUTA PARA EL GRÁFICO (CORREGIDA Y SEGURA)
// ===================================================================

// FIX 1: La ruta es '/ventas-grafico', no '/dashboard/ventas-grafico'
router.get('/ventas-grafico', async (req, res) => {
    const { inicio, fin } = req.query;

    if (!inicio || !fin) {
        return res.status(400).json({ success: false, message: 'Fechas de inicio y fin son requeridas.' });
    }

    try {
        // FIX 2: Llamada segura usando parámetros '?'
        const sql = `CALL \`${dbConfig.database}\`.\`sp_Dashboard_VentasPorPeriodo\`(?, ?)`;
        const params = [inicio, fin];
        
        // Pasamos la consulta y los parámetros a la función mejorada
        const graficoData = await queryAsync(sql, params); 
        
        res.status(200).json(graficoData); 
    
    } catch (error) {
        console.error("Error al cargar datos del gráfico:", error);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor.' });
    }
});

router.get('/top10-abc', async (req, res) => {
    // Recibe el 'name' del gráfico, ej: 'A (Productos) (85 arts.)'
    const { categoria } = req.query;
    console.log("Categoría recibida:", categoria);
    if (!categoria) {
        return res.status(400).json({ success: false, message: 'La categoría es requerida.' });
    }

    try {
        const sql = `CALL \`${dbConfig.database}\`.\`sp_Dashboard_Top10_PorTipo\`(?)`;
        const params = [categoria]; // El SP ya traduce el nombre
        
        const top10Data = await queryAsync(sql, params); 
        
        res.status(200).json(top10Data); 
        console.log("datos recibidos del Top 10 ABC:", top10Data);
    
    } catch (error) {
        console.error("Error al cargar datos del Top 10 ABC:", error);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor.' });
    }
});

router.get('/descargar-abc', async (req, res) => {
    const { categoria } = req.query;
    console.log("Categoría recibida para DESCARGA:", categoria);

    if (!categoria) {
        return res.status(400).json({ success: false, message: 'La categoría es requerida.' });
    }

    try {
        // 1. Llama al NUEVO Stored Procedure
        const sql = `CALL \`${dbConfig.database}\`.\`sp_Dashboard_DescargarInventarioABC\`(?)`;
        const params = [categoria];
        
        const fullData = await queryAsync(sql, params); 
        
        res.status(200).json(fullData); 
        console.log("Datos enviados para descarga:", fullData.length, "filas");
    
    } catch (error) {
        console.error("Error al cargar datos para descarga ABC:", error);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor.' });
    }
});

router.get('/pedidos', async (req, res) => {
    const { diasAlerta } = req.query;

    if (!diasAlerta || isNaN(parseInt(diasAlerta))) {
        return res.status(400).json({ success: false, message: 'El parámetro "diasAlerta" es requerido y debe ser un número.' });
    }

    try {
        const sql = `CALL \`${dbConfig.database}\`.\`sp_Dashboard_Pedidos\`(?)`;
        const params = [parseInt(diasAlerta)];
        
        const pedidosData = await queryAsync(sql, params); 
        
        res.status(200).json(pedidosData); 
    
    } catch (error) {
        console.error("Error al cargar datos del dashboard de pedidos:", error);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor.' });
    }
});


module.exports = router;