// routes/noticias.routes.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

/* =========
   Helpers
   ========= */

// Validación mínima al crear
function validateCreate(req, res, next) {
  const { titulo, descripcion, fecha } = req.body;
  if (!titulo || !descripcion || !fecha) {
    return res.status(400).json({ error: "titulo, descripcion y fecha son obligatorios" });
  }
  next();
}

// Para updates parciales
function buildUpdateSet(body) {
  const allowed = ["titulo", "descripcion", "fecha", "imagen1", "imagen2", "imagen3"];
  const fields = [];
  const values = [];
  for (const key of allowed) {
    if (body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(body[key]);
    }
  }
  return { fields, values };
}

/* =========
   Rutas
   ========= */

// GET: listar todas
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_noticias, titulo, descripcion, fecha, imagen1, imagen2, imagen3 FROM noticias ORDER BY id_noticias DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener noticias:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// GET: una por id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT id_noticias, titulo, descripcion, fecha, imagen1, imagen2, imagen3 FROM noticias WHERE id_noticias = ?",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Noticia no encontrada" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener noticia:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// POST: crear noticia
router.post("/", validateCreate, async (req, res) => {
  try {
    const { titulo, descripcion, fecha, imagen1 = null, imagen2 = null, imagen3 = null } = req.body;

    const [result] = await pool.query(
      `INSERT INTO noticias (titulo, descripcion, fecha, imagen1, imagen2, imagen3)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [titulo, descripcion, fecha, imagen1, imagen2, imagen3]
    );

    const [nueva] = await pool.query(
      "SELECT id_noticias, titulo, descripcion, fecha, imagen1, imagen2, imagen3 FROM noticias WHERE id_noticias = ?",
      [result.insertId]
    );
    res.status(201).json(nueva[0]);
  } catch (error) {
    console.error("Error al crear noticia:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// PUT: actualizar (parcial o completo)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fields, values } = buildUpdateSet(req.body);
    if (fields.length === 0) {
      return res.status(400).json({ error: "No se enviaron campos para actualizar" });
    }

    // Verifica existencia
    const [exist] = await pool.query("SELECT id_noticias FROM noticias WHERE id_noticias = ?", [id]);
    if (exist.length === 0) return res.status(404).json({ error: "Noticia no encontrada" });

    const sql = `UPDATE noticias SET ${fields.join(", ")} WHERE id_noticias = ?`;
    await pool.query(sql, [...values, id]);

    const [actualizada] = await pool.query(
      "SELECT id_noticias, titulo, descripcion, fecha, imagen1, imagen2, imagen3 FROM noticias WHERE id_noticias = ?",
      [id]
    );
    res.json(actualizada[0]);
  } catch (error) {
    console.error("Error al actualizar noticia:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// DELETE: eliminar
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [exist] = await pool.query("SELECT id_noticias FROM noticias WHERE id_noticias = ?", [id]);
    if (exist.length === 0) return res.status(404).json({ error: "Noticia no encontrada" });

    await pool.query("DELETE FROM noticias WHERE id_noticias = ?", [id]);
    res.json({ message: "Noticia eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar noticia:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;

