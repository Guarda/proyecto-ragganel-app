const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db'); // Asegúrate que la ruta al archivo de conexión de BD sea correcta


// ===================================================================
// FUNCIÓN queryAsync (CORREGIDA PARA MÚLTIPLES RESULT SETS)
// ===================================================================
const queryAsync = (sql, params = []) => { 
  return new Promise((resolve, reject) => {
    Basedatos.query(sql, params, (err, results) => { 
      if (err) return reject(err);

      // --- ESTA ES LA CORRECCIÓN IMPORTANTE ---
      // El SP de pronóstico devuelve MÚLTIPLES result sets: [ [Resumen], [Grafico] ]
      // Otros SPs devuelven solo uno: [ [Resultados] ]
      // Esta lógica ahora devuelve CUALQUIER COSA que entregue MySQL (sea uno o más result sets)
      // para que el frontend decida qué hacer.
      resolve(results); 
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
            // queryAsync devolverá [ [Resultados] ], así que seleccionamos [0]
            queryAsync(`CALL \`${dbConfig.database}\`.\`sp_Dashboard_KPIs\`()`).then(r => r[0]),
            queryAsync(`CALL \`${dbConfig.database}\`.\`sp_Dashboard_Top5ArticulosVendidos\`()`).then(r => r[0]),
            queryAsync(`CALL \`${dbConfig.database}\`.\`sp_Dashboard_VentasPorVendedor\`()`).then(r => r[0]),
            queryAsync(`CALL \`${dbConfig.database}\`.\`sp_Dashboard_Ultimas5Ventas\`()`).then(r => r[0]),
            queryAsync(`CALL \`${dbConfig.database}\`.\`sp_Dashboard_AlertasStockBajo\`()`).then(r => r[0]),
            queryAsync(`CALL \`${dbConfig.database}\`.\`sp_Dashboard_ValorInventarioABC\`()`).then(r => r[0])
        ]);

        res.status(200).json({
            success: true,
            data: {
                kpis: kpis[0], 
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
router.get('/ventas-grafico', async (req, res) => {
    const { inicio, fin } = req.query;

    if (!inicio || !fin) {
        return res.status(400).json({ success: false, message: 'Fechas de inicio y fin son requeridas.' });
    }

    try {
        const sql = `CALL \`${dbConfig.database}\`.\`sp_Dashboard_VentasPorPeriodo\`(?, ?)`;
        const params = [inicio, fin];
        
        // queryAsync devolverá [ [Resultados] ]
        const graficoData = await queryAsync(sql, params); 
        
        res.status(200).json(graficoData[0]); // Enviamos solo el primer result set
    
    } catch (error) {
        console.error("Error al cargar datos del gráfico:", error);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor.' });
    }
});

router.get('/top10-abc', async (req, res) => {
    const { categoria } = req.query;
    console.log("Categoría recibida:", categoria);
    if (!categoria) {
        return res.status(400).json({ success: false, message: 'La categoría es requerida.' });
    }

    try {
        const sql = `CALL \`${dbConfig.database}\`.\`sp_Dashboard_Top10_PorTipo\`(?)`;
        const params = [categoria]; 
        
        const top10Data = await queryAsync(sql, params); 
        
        res.status(200).json(top10Data[0]); // Enviamos solo el primer result set
        console.log("datos recibidos del Top 10 ABC:", top10Data[0]);
    
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
        const sql = `CALL \`${dbConfig.database}\`.\`sp_Dashboard_DescargarInventarioABC\`(?)`;
        const params = [categoria];
        
        const fullData = await queryAsync(sql, params); 
        
        res.status(200).json(fullData[0]); // Enviamos solo el primer result set
        console.log("Datos enviados para descarga:", fullData[0].length, "filas");
    
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
        
        res.status(200).json(pedidosData[0]); // Enviamos solo el primer result set
    
    } catch (error) {
        console.error("Error al cargar datos del dashboard de pedidos:", error);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor.' });
    }
});

// ===================================================================
// ⭐️ RUTA QUE FALTABA ⭐️
// ===================================================================
router.get('/modelos-pronostico', async (req, res) => {
    try {
        const sql = `CALL \`${dbConfig.database}\`.\`sp_ListarModelosParaPronostico\`()`;
        
        // Esta llamada devolverá [ [Modelos] ]
        const modelosData = await queryAsync(sql); 
        
        res.status(200).json(modelosData[0]); // Enviamos el array de modelos
    
    } catch (error) {
        console.error("Error al cargar la lista de modelos para pronóstico:", error);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor.' });
    }
});

// ===================================================================
// RUTA DE PRONÓSTICO (AHORA FUNCIONA CON EL queryAsync CORREGIDO)
// ===================================================================
router.get('/pronostico-modelo', async (req, res) => {
    const { idModelo, tipoArticulo, mesesHistorial } = req.query;

    if (!idModelo || !tipoArticulo || !mesesHistorial) {
        return res.status(400).json({ success: false, message: 'Los parámetros idModelo, tipoArticulo, y mesesHistorial son requeridos.' });
    }

    try {
        const sql = `CALL \`${dbConfig.database}\`.\`sp_Reporte_PronosticoPorModelo\`(?, ?, ?)`;
        
        const params = [
            parseInt(idModelo),
            parseInt(tipoArticulo),
            parseInt(mesesHistorial)
        ];
        
        // queryAsync ahora devuelve [ [Resumen], [DatosGrafico] ]
        const pronosticoData = await queryAsync(sql, params); 
        
        // Enviamos la respuesta cruda (los dos arrays) al frontend
        res.status(200).json(pronosticoData); 
    
    } catch (error) {
        console.error("Error al cargar datos del pronóstico por modelo:", error);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor.' });
    }
});

router.get('/reporte-pronostico-masivo', async (req, res) => {
    const { mesesHistorial } = req.query;

    if (!mesesHistorial || isNaN(parseInt(mesesHistorial))) {
        return res.status(400).json({ success: false, message: 'El parámetro "mesesHistorial" es requerido.' });
    }

    try {
        const sql = `CALL \`${dbConfig.database}\`.\`sp_Reporte_PronosticoMasivo\`(?)`;
        const params = [parseInt(mesesHistorial)];
        
        // Esta llamada devolverá [ [Resultados] ]
        const reporteData = await queryAsync(sql, params); 
        
        // Devolvemos el primer (y único) result set, que es la lista de pronósticos
        res.status(200).json(reporteData[0]); 
    
    } catch (error) {
        console.error("Error al generar el reporte masivo de pronóstico:", error);
        res.status(500).json({ success: false, mensaje: 'Error en el servidor.' });
    }
});

module.exports = router;