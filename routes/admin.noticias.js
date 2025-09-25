// routes/admin.noticias.routes.js
import express from "express";
import pool from "../db.js";
import upload from "../utils/upload.js";
import { validateCreate, buildUpdateSet, sanitize, toNullIfEmpty } from "../utils/validacion.js";

const router = express.Router();

// POST /admin/noticias
// form-data: titulo, descripcion, fecha(opc), imagenes(0..3)
router.post(
  "/",
  upload.array("imagenes", 3),
  validateCreate,
  async (req, res) => {
    try {
      const { titulo, descripcion, fecha } = req.body;

      const files = req.files || [];
      const paths = files.map((f) => `/uploads/${f.filename}`);
      const imagen1 = paths[0] || toNullIfEmpty(req.body.imagen1);
      const imagen2 = paths[1] || toNullIfEmpty(req.body.imagen2);
      const imagen3 = paths[2] || toNullIfEmpty(req.body.imagen3);

      const [result] = await pool.query(
        `INSERT INTO noticias (titulo, descripcion, fecha, imagen1, imagen2, imagen3)
         VALUES (?, ?, COALESCE(?, CURDATE()), ?, ?, ?)`,
        [titulo, descripcion, fecha, imagen1, imagen2, imagen3]
      );

      const [nueva] = await pool.query(
        "SELECT id_noticias, titulo, descripcion, fecha, imagen1, imagen2, imagen3 FROM noticias WHERE id_noticias = ?",
        [result.insertId]
      );
      res.status(201).json({ ok: true, item: nueva[0] });
    } catch (error) {
      console.error("Error al crear noticia:", error);
      return res.status(500).json({ ok: false, error: "Error en el servidor" });
    }
  }
);

// PUT /admin/noticias/:id
// Puede recibir imágenes nuevas y/o campos textuales
router.put(
  "/:id",
  upload.array("imagenes", 3),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Validaciones mínimas para evitar datos corruptos
      if (req.body.titulo !== undefined) {
        const t = sanitize(req.body.titulo);
        if (t.length < 5 || t.length > 150) {
          return res.status(422).json({ ok: false, errors: ["El título debe tener entre 5 y 150 caracteres."] });
        }
      }
      if (req.body.descripcion !== undefined) {
        const d = sanitize(req.body.descripcion);
        if (!d) return res.status(422).json({ ok: false, errors: ["La descripción no puede quedar vacía."] });
      }
      if (req.body.fecha !== undefined) {
        const f = sanitize(req.body.fecha);
        if (f && !/^\d{4}-\d{2}-\d{2}$/.test(f)) {
          return res.status(422).json({ ok: false, errors: ["La fecha debe tener formato YYYY-MM-DD."] });
        }
      }

      const [exist] = await pool.query("SELECT * FROM noticias WHERE id_noticias = ?", [id]);
      if (exist.length === 0) return res.status(404).json({ ok: false, error: "Noticia no encontrada" });
      const curr = exist[0];

      // Campos textuales (parciales)
      const { fields, values } = buildUpdateSet(req.body);

      // Imágenes: si vienen nuevas, reemplazan; si no, se preservan
      const files = req.files || [];
      const paths = files.map((f) => `/uploads/${f.filename}`);
      const newImagen1 = paths[0] || curr.imagen1;
      const newImagen2 = paths[1] || curr.imagen2;
      const newImagen3 = paths[2] || curr.imagen3;

      // Si no se envía nada, error
      const willUpdateImages =
        (files.length > 0) || (req.body.imagen1 !== undefined) || (req.body.imagen2 !== undefined) || (req.body.imagen3 !== undefined);

      // Asegurar que actualizamos imágenes si corresponde
      if (willUpdateImages) {
        fields.push("imagen1 = ?", "imagen2 = ?", "imagen3 = ?");
        values.push(
          toNullIfEmpty(paths[0]) ?? newImagen1,
          toNullIfEmpty(paths[1]) ?? newImagen2,
          toNullIfEmpty(paths[2]) ?? newImagen3
        );
      }

      if (fields.length === 0) {
        return res.status(400).json({ ok: false, error: "No se enviaron campos para actualizar" });
      }

      const sql = `UPDATE noticias SET ${fields.join(", ")} WHERE id_noticias = ?`;
      await pool.query(sql, [...values, id]);

      const [actualizada] = await pool.query(
        "SELECT id_noticias, titulo, descripcion, fecha, imagen1, imagen2, imagen3 FROM noticias WHERE id_noticias = ?",
        [id]
      );
      res.json({ ok: true, item: actualizada[0] });
    } catch (error) {
      console.error("Error al actualizar noticia:", error);
      res.status(500).json({ ok: false, error: "Error en el servidor" });
    }
  }
);

// DELETE /admin/noticias/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [exist] = await pool.query("SELECT id_noticias FROM noticias WHERE id_noticias = ?", [id]);
    if (exist.length === 0) return res.status(404).json({ ok: false, error: "Noticia no encontrada" });

    await pool.query("DELETE FROM noticias WHERE id_noticias = ?", [id]);
    res.json({ ok: true, message: "Noticia eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar noticia:", error);
    res.status(500).json({ ok: false, error: "Error en el servidor" });
  }
});

export default router;
