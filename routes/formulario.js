// ./routes/formulario.js
import express from "express";
import db from "../db.js";
import { enviarConfirmacionFormulario } from "../utils/mailer.js";
import { codigosVerificacion } from "../utils/codigo_verif.js";
import { enviarCodigoVerificacion } from "../utils/mailer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { dni, alumno, mail, respuestas_formulario, modalidad_elegida } = req.body;

    const [rows] = await db.query("SELECT formulario_modalidad_enviado FROM alumnos WHERE dni = ?", [dni]);
    if (rows.length > 0 && rows[0].formulario_modalidad_enviado) {
      return res.status(400).json({ mensaje: "Ya enviaste el formulario. Comunicate con la dirección." });
    }

    await db.query(
      `INSERT INTO alumnos (dni, alumno, mail, respuestas_formulario, modalidad_elegida, formulario_modalidad_enviado)
       VALUES (?, ?, ?, ?, ?, 1)
       ON DUPLICATE KEY UPDATE
         alumno = VALUES(alumno),
         mail = VALUES(mail),
         respuestas_formulario = VALUES(respuestas_formulario),
         modalidad_elegida = VALUES(modalidad_elegida),
         formulario_modalidad_enviado = 1,
         updated_at = CURRENT_TIMESTAMP`,
      [dni, alumno, mail, JSON.stringify(respuestas_formulario), modalidad_elegida]
    );

    await enviarConfirmacionFormulario(mail, alumno, dni, modalidad_elegida, respuestas_formulario);

    res.json({ mensaje: "Formulario enviado y confirmado por mail." });
  } catch (err) {
    console.error("Error guardando formulario:", err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// 👉 POST /pedir-codigo
router.post("/pedir-codigo", async (req, res) => {
  const { dni, mail, alumno } = req.body;  // 👈 usamos "alumno"
  if (!dni || !mail || !alumno) {
    return res.status(400).json({ 
      error: "Falta DNI, alumno o mail" 
    });
  }

  try {
    // ✅ Validar si existe en la base de datos
    const [rows] = await db.query(
      "SELECT * FROM alumnos WHERE dni = ? AND alumno = ?",
      [dni, alumno]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        error: "El usuario ingresado no se encuentra registrado en la institución. Verifique los datos de ingreso o comuníquese con los directivos."
      });
    }

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar en memoria, expira en 5 minutos
    codigosVerificacion[dni] = {
      codigo,
      mail,
      expiracion: Date.now() + 5 * 60 * 1000
    };

    await enviarCodigoVerificacion(mail, codigo);
    res.json({ mensaje: "Código enviado al mail" });

  } catch (err) {
    console.error("Error en /pedir-codigo:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// 👉 POST /validar-codigo
router.post("/validar-codigo", (req, res) => {
  const { dni, codigo } = req.body;
  if (!dni || !codigo) return res.status(400).json({ error: "Falta DNI o código" });

  const entry = codigosVerificacion[dni];
  if (!entry) return res.status(400).json({ error: "No se solicitó código para este DNI" });

  if (Date.now() > entry.expiracion) {
    delete codigosVerificacion[dni];
    return res.status(400).json({ error: "Código expirado" });
  }

  if (entry.codigo !== codigo) return res.status(400).json({ error: "Código incorrecto" });

  res.json({ mensaje: "Código válido, puede completar el formulario", mail: entry.mail });
});

export default router;
