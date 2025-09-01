import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET: listar noticias
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM noticias");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener noticias:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
