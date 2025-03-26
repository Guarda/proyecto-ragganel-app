const jwt = require('jsonwebtoken');
const config = require('../config/keys');

// Middleware para verificar JWT
function verificarToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], config.jwtSecret); // El token viene en formato 'Bearer <token>'
        req.usuario = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token inválido' });
    }
}

module.exports = verificarToken;

