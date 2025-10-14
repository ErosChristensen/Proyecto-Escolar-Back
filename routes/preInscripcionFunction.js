import express from "express";
import db from "../db.js"; 

const router = express.Router();

/* ============================================================
   🔸 ENDPOINT: DAR DE ALTA (mueve de pre_inscripcion → alumnos)
   ============================================================ */
router.post("/alta/:id", async (req, res) => {
  const { id } = req.params;

  const conn = db;
  try {
    // 1️⃣ Obtener los datos del registro en pre_inscripcion
    const [rows] = await conn.execute(
      "SELECT * FROM pre_inscripcion WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    const pre = rows[0];

    // 2️⃣ Insertar en alumnos
    await conn.execute(
      `INSERT INTO alumnos 
        (nombre, apellido, dni, fecha_nacimiento, url_pdf1, url_pdf2, fecha_registro, mail, ip_envio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pre.nombre,
        pre.apellido,
        pre.dni,
        pre.fecha_nacimiento,
        pre.url_pdf1,
        pre.url_pdf2,
        pre.fecha_registro,
        pre.mail,
        pre.ip_envio,
      ]
    );

    // 3️⃣ Eliminar de pre_inscripcion
    await conn.execute("DELETE FROM pre_inscripcion WHERE id = ?", [id]);

    res.json({ message: "Alumno dado de alta correctamente" });
  } catch (error) {
    console.error("Error en darDeAlta:", error);
    res.status(500).json({ message: "Error al dar de alta", error: error.message });
  }
});

/* ============================================================
   🔸 ENDPOINT: DAR DE BAJA (elimina de pre_inscripcion)
   ============================================================ */
router.delete("/baja/:id", async (req, res) => {
  const { id } = req.params;

  const conn = db;
  try {
    const [result] = await conn.execute(
      "DELETE FROM pre_inscripcion WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    console.error("Error en darDeBaja:", error);
    res.status(500).json({ message: "Error al dar de baja", error: error.message });
  }
});

export default router;
