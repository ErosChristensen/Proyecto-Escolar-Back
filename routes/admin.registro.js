import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

/* ==========================================================
   1️⃣ GET /admin/preinscripciones
   ----------------------------------------------------------
   Devuelve los registros de la tabla pre_inscripcion
========================================================== */
router.get('/preinscripcion', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        url_pdf1,
        url_pdf2,
        fecha_registro,
        mail,
        created_at,
        ip_envio
      FROM pre_inscripcion
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener preinscripciones:', error);
    res.status(500).json({ message: 'Error al obtener las preinscripciones.' });
  }
});

/* ==========================================================
   2️⃣ GET /admin/modalidades
   ----------------------------------------------------------
   Devuelve los alumnos con sus respuestas y modalidad elegida
========================================================== */
router.get('/modalidades', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        mail,
        modalidad_elegida,
        respuestas_formulario,
        formulario_modalidad_enviado,
        fecha_registro,
        anio,
        ip_envio
      FROM alumnos
      ORDER BY created_at DESC
    `);

    // Parseamos el JSON de respuestas_formulario
    const alumnos = rows.map(alumno => ({
      ...alumno,
      respuestas_formulario: alumno.respuestas_formulario
        ? JSON.parse(alumno.respuestas_formulario)
        : null
    }));

    res.json(alumnos);
  } catch (error) {
    console.error('Error al obtener modalidades:', error);
    res.status(500).json({ message: 'Error al obtener los datos de modalidad.' });
  }
});

export default router;
