const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

/**
 * @route   GET /api/validate/code/:code
 * @desc    Verifica si un código de modelo ya existe en el sistema.
 * @access  Private (asumido, protegido por guardas en el frontend)
 */
router.get('/code/:code', (req, res) => {
    const codeToValidate = req.params.code;

    if (!codeToValidate) {
        return res.status(400).json({ error: 'Se requiere un código para validar.' });
    }

    const sql = `CALL \`${dbConfig.database}\`.\`sp_VerificarCodigoUnico\`(?)`;

    Basedatos.query(sql, [codeToValidate], (err, result) => {
        if (err) {
            console.error('Error al validar el código:', err);
            return res.status(500).json({ error: 'Error interno del servidor al validar el código.' });
        }
        res.json({ exists: result[0].length > 0 });
    });
});

module.exports = router;