// modifications_historia.js
import express from "express";

const router = express.Router();

// Ruta de prueba
router.get("/", (req, res) => {
  res.json({ mensaje: "Ruta de noticias funcionando!" });
});

export default router;
