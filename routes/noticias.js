// routes/noticias.routes.js
import express from "express";
import pool from "../db.js";
import stringSimilarity from "string-similarity";
import { parseListQuery } from "../utils/validacion.js";

const router = express.Router();

function validateCreate(req, res, next) {
  const { titulo, descripcion, fecha } = req.body;
  if (!titulo || !descripcion || !fecha) {
    return res.status(400).json({ error: "titulo, descripcion y fecha son obligatorios" });
  }
  next();
}
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

router.get("/", parseListQuery, async (req, res) => {
  const { q, page, pageSize, offset } = req;

  try {
    // 1) Sin query o muy corta -> últimas
    if (!q || q.length < 3) {
      const [rows] = await pool.query(
        `SELECT SQL_CALC_FOUND_ROWS id_noticias, titulo, descripcion, fecha, imagen1, imagen2, imagen3
           FROM noticias
          ORDER BY fecha DESC, id_noticias DESC
          LIMIT ? OFFSET ?`,
        [pageSize, offset]
      );
      const [[{ "FOUND_ROWS()": total }]] = await pool.query("SELECT FOUND_ROWS()");
      return res.json({
        ok: true,
        mode: "latest",
        hint: !q ? "Mostrando últimas novedades." : "Búsqueda muy corta; se muestran últimas novedades.",
        page,
        pageSize,
        total,
        items: rows,
      });
    }

    // 2) Búsqueda básica con LIKE
    const like = `%${q}%`;
    let [items] = await pool.query(
      `SELECT id_noticias, titulo, descripcion, fecha, imagen1, imagen2, imagen3
         FROM noticias
        WHERE titulo LIKE ? OR descripcion LIKE ?
        ORDER BY fecha DESC, id_noticias DESC
        LIMIT ? OFFSET ?`,
      [like, like, pageSize, offset]
    );

    // 3) Sugerencia si hay pocos resultados
    let suggestion = null;
    if (items.length < 3) {
      const [allTitles] = await pool.query(`SELECT titulo FROM noticias`);
      const candidates = allTitles.map((r) => r.titulo);
      if (candidates.length > 0) {
        const { bestMatch } = stringSimilarity.findBestMatch(q, candidates);
        if (
          bestMatch &&
          bestMatch.rating >= 0.45 &&
          bestMatch.target.toLowerCase() !== q.toLowerCase()
        ) {
          suggestion = bestMatch.target;
          // Reintento con la sugerencia
          const likeSug = `%${suggestion}%`;
          const [rows2] = await db.query(
            `SELECT id_noticias, titulo, descripcion, fecha, imagen1, imagen2, imagen3
               FROM noticias
              WHERE titulo LIKE ? OR descripcion LIKE ?
              ORDER BY fecha DESC, id_noticias DESC
              LIMIT ? OFFSET ?`,
            [likeSug, likeSug, pageSize, offset]
          );
          if (rows2.length > items.length) items = rows2;
        }
      }
    }

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total
         FROM noticias
        WHERE (? = '' OR titulo LIKE CONCAT('%', ?, '%') OR descripcion LIKE CONCAT('%', ?, '%'))`,
      [q, q, q]
    );

    return res.json({
      ok: true,
      mode: "search",
      query: q,
      suggestion, // para mostrar “¿Quisiste decir …?”
      page,
      pageSize,
      total: countRows[0].total,
      items,
    });
  } catch (error) {
    console.error("Error al obtener noticias:", error);
    res.status(500).json({ ok: false, error: "Error en el servidor" });
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




export default router;

