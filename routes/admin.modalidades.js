import express from "express";
import db from "../db.js";

const router = express.Router();

// 📌 Obtener los registros de alumnos con modalidad
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        nombre,
        apellido,
        mail,
        modalidad_elegida,
        respuestas_formulario
      FROM alumnos
      WHERE modalidad_elegida IS NOT NULL
      ORDER BY created_at DESC
    `);

    const alumnos = rows.map(a => ({
  ...a,
  respuestas_formulario: typeof a.respuestas_formulario === "string"
    ? JSON.parse(a.respuestas_formulario)
    : a.respuestas_formulario
}));

res.json(alumnos);


  } catch (error) {
    console.error("[ERROR GET /admin/modalidades]", error);
    res.status(500).json({ error: "Error al obtener los registros de modalidades" });
  }
});

export default router;
