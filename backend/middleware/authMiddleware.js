// Archivo: middleware/authMiddleware.js
// VERSIÓN CORREGIDA

const jwt = require('jsonwebtoken');
const config = require('../config/keys'); // <-- Lee de keys.js

// Middleware para verificar JWT
function verificarToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Acceso denegado, token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Formato de token inválido, falta "Bearer ".' });
    }

    try {
        // ⭐️ Aseguramos que usa la clave correcta de tu keys.js
        const decoded = jwt.verify(token, config.JWT_SECRET_KEY); 
        
        req.usuario = decoded; // Guardamos el payload
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            console.error('Error de autenticación: El token ha expirado.');
            return res.status(401).json({ message: 'Token expirado. Por favor, inicie sesión de nuevo.' });
        }
        if (err.name === 'JsonWebTokenError') {
            console.error('Error de autenticación: Token malformado o firma inválida.', err.message);
            return res.status(401).json({ message: 'Token inválido o corrupto.' });
        }
        
        console.error('Error de autenticación desconocido:', err);
        res.status(401).json({ message: 'Error de autenticación. Token inválido.' });
    }
}

module.exports = verificarToken;