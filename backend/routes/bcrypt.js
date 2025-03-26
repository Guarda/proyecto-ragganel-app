const bcrypt = require('bcryptjs');

// Generar un hash de contraseña
const saltRounds = 10;
const password = 'miContraseñaSecreta';
bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Hash generado:', hash);
    }
});

// Comparar la contraseña ingresada con el hash almacenado
const storedHash = '$2a$10$D0MiQm3jkvXnp8JYFCQkLOdVjroV2foy.BF9fo5W1L3oxl4t6ppdS'; // Un hash de ejemplo
bcrypt.compare(password, storedHash, (err, isMatch) => {
    if (err) {
        console.log(err);
    } else if (isMatch) {
        console.log('Las contraseñas coinciden');
    } else {
        console.log('Las contraseñas no coinciden');
    }
});
