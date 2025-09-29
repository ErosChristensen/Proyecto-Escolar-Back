// ./utils/codigo_verif.js
// Objeto en memoria para almacenar códigos temporales
// Estructura: { 'DNI': { codigo: '123456', mail: 'correo@mail.com', expiracion: Date } }

export const codigosVerificacion = {};

// Función para generar un código de 6 dígitos y guardarlo
export function generarCodigo(dni, mail) {
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  codigosVerificacion[dni] = {
    codigo,
    mail,
    expiracion: Date.now() + 5 * 60 * 1000 // expira en 5 minutos
  };
  return codigo;
}

// Función para validar el código
export function validarCodigo(dni, codigo) {
  const entry = codigosVerificacion[dni];
  if (!entry) return { valido: false, error: "No se solicitó código para este DNI" };
  if (Date.now() > entry.expiracion) {
    delete codigosVerificacion[dni];
    return { valido: false, error: "Código expirado" };
  }
  if (entry.codigo !== codigo) return { valido: false, error: "Código incorrecto" };
  return { valido: true, mail: entry.mail };
}
