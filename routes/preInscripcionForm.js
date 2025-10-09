import express from 'express';
import db from '../db.js'; // conexión mysql2/promise

const router = express.Router();

// Normaliza DNI entrante: devuelve solo dígitos (evita puntos, espacios, guiones)
function normalizeDNI(raw) {
  if (raw == null) return '';
  const onlyDigits = String(raw).replace(/\D/g, '');
  return onlyDigits;
}

// Valida el formato de DNI: 8 dígitos y no empieza en 0
function isValidDNI(dni) {
  return /^[1-9]\d{7}$/.test(dni);
}

router.post('/registrar', async (req, res) => {
  try {
    // Desestructuro los campos que espero recibir desde el Apps Script
    const { nombre, apellido, dni: dniRaw, fecha_nacimiento, url_pdf1, url_pdf2, mail } = req.body || {};

    // Normalizo el DNI para usarlo internamente
    const dni = normalizeDNI(dniRaw);

    // Intento obtener la IP real si el request viene detrás de un proxy (x-forwarded-for)
    const ip_envio = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || null;

    // Validaciones mínimas: nombre/apellido y dni válido
    if (!nombre || !apellido || !dni || !isValidDNI(dni)) {
      return res.status(400).json({
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Datos inválidos. Verificá nombre, apellido y DNI (8 dígitos, sin ceros iniciales).'
      });
    }

    // INSERT directo: la UNIQUE KEY(dni) en la tabla evitará duplicados en concurrencia
    const sql = `
      INSERT INTO pre_inscripcion
        (nombre, apellido, dni, fecha_nacimiento, url_pdf1, url_pdf2, mail, ip_envio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Ejecuta la inserción con parámetros para evitar inyecciones
    await db.query(sql, [
      nombre.trim(),
      apellido.trim(),
      dni,
      fecha_nacimiento || null,  // si no viene, insertar null (si tu columna NO NULL -> cambiar)
      (url_pdf1 || null),
      (url_pdf2 || null),
      (mail || null),            // aquí se guarda el mail que manda Apps Script
      ip_envio
    ]);

    // Respuesta exitosa para Apps Script
    return res.status(201).json({
      success: true,
      code: 'CREATED',
      message: 'Preinscripción registrada correctamente.'
    });

  } catch (err) {
    // Si la inserción falla por duplicado de índice único (dni), devuelvo 409
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        code: 'DNI_DUPLICADO',
        message: 'El DNI ya se encuentra registrado.'
      });
    }
    // Cualquier otro error -> 500 y logueo en consola del server
    console.error('Error al insertar en la base de datos:', err);
    return res.status(500).json({ success: false, code: 'SERVER_ERROR', message: 'Error al guardar los datos.' });
  }
});

export default router;
