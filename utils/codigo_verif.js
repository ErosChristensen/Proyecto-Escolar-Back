// Objeto en memoria para almacenar códigos temporales
// Estructura: { 'DNI': { codigo, mail, expiracion, intentos, bloqueadoHasta } }
export const codigosVerificacion = {};

// Función para generar un código y guardarlo
export function generarCodigo(dni, mail) {
const codigo = Math.floor(100000 + Math.random() * 900000).toString();

codigosVerificacion[dni] = {
codigo,
mail,
expiracion: Date.now() + 5 * 60 * 1000, // expira en 5 min
intentos: 0, // intentos fallidos
bloqueadoHasta: null // si supera el límite → se bloquea
};

return codigo;
}

// Validar código recibido
export function validarCodigo(dni, codigoIngresado) {
const entry = codigosVerificacion[dni];
if (!entry) return { valido: false, error: "No se solicitó código para este DNI" };

// Bloqueo por demasiados intentos fallidos
if (entry.bloqueadoHasta && Date.now() < entry.bloqueadoHasta) {
return { valido: false, error: "Demasiados intentos fallidos. Intente más tarde." };
}

// Expiración
if (Date.now() > entry.expiracion) {
delete codigosVerificacion[dni];
return { valido: false, error: "Código expirado" };
}

// Comparar códigos
if (entry.codigo !== codigoIngresado) {
entry.intentos += 1;
if (entry.intentos >= 3) {
entry.bloqueadoHasta = Date.now() + 10 * 60 * 1000; // bloquea 10 min
}
return { valido: false, error: "Código incorrecto" };
}

// Código válido → se elimina para no reutilizar
const mail = entry.mail;
delete codigosVerificacion[dni];
return { valido: true, mail };
}
