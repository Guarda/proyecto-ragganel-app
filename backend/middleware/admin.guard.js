// Archivo: middleware/admin.guard.js
// VERSIÓN CORREGIDA (de nuevo)

const ADMIN_ROLE_ID = 1; // Rol de Admin es 1

const adminOnlyGuard = (req, res, next) => {
    try {
        console.log('=======================================');
        console.log('ADMIN GUARD: Verificando permisos...');
        
        // ⭐️ LA CORRECCIÓN ESTÁ AQUÍ ⭐️
        // 'auth.js' ahora guarda el rol como 'IdRolFK'
        console.log('ADMIN GUARD: Contenido de req.usuario:', req.usuario);

        if (!req.usuario || req.usuario.IdRolFK === undefined) { // <-- Buscamos 'IdRolFK'
            console.error('ADMIN GUARD: RECHAZADO. req.usuario no existe o no contiene "IdRolFK".');
            return res.status(403).json({ message: 'No se encontró información de rol de usuario. Acceso denegado.' });
        }

        if (req.usuario.IdRolFK !== ADMIN_ROLE_ID) { // <-- Comparamos 'IdRolFK'
            console.error(`ADMIN GUARD: RECHAZADO. Rol requerido: ${ADMIN_ROLE_ID}, Rol del usuario: ${req.usuario.IdRolFK}`);
            return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de Administrador.' });
        }
        
        console.log('ADMIN GUARD: Acceso concedido.');
        console.log('=======================================');
        next();

    } catch (error) {
        console.error("Error fatal en adminOnlyGuard:", error);
        res.status(500).json({ message: 'Error interno del servidor al verificar permisos.' });
    }
};

module.exports = adminOnlyGuard;