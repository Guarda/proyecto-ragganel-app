const express = require('express');
const router = express.Router();
const { Basedatos, dbConfig } = require('../config/db');

// List all users roles
router.get('/', (req, res) => {
    Basedatos.query(`CALL \`${dbConfig.database}\`.\`ListarRolesUsuarios\`();`, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching users');
            console.log(err);
            return;
        }
        res.json(results[0]);
    });
});

module.exports = router;