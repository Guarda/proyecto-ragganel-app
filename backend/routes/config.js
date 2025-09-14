const express = require('express');
const router = express.Router();
const { environment } = require('../config/db');

/**
 * @route   GET /config/environment
 * @desc    Devuelve el entorno actual del servidor (development o production).
 * @access  Public
 */
router.get('/environment', (req, res) => {
    res.json({ environment: environment });
});

module.exports = router;