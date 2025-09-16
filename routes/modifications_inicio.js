// routes/modifications_inicio.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const filePath = path.resolve("content/inicio.json");

const readData = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const writeData = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

// GET /inicio
router.get("/", (req, res) => {
  try {
    res.json(readData());
  } catch {
    res.status(500).json({ error: "Error leyendo inicio.json" });
  }
});

// PUT /inicio
router.put("/", (req, res) => {
  try {
    writeData(req.body);
    res.json({ message: "Inicio reemplazado", data: req.body });
  } catch {
    res.status(500).json({ error: "Error guardando inicio.json" });
  }
});

// PATCH /inicio/:campo
router.patch("/:campo", (req, res) => {
  try {
    const data = readData();
    const { campo } = req.params;
    if (!(campo in data)) {
      return res.status(400).json({ error: `Campo '${campo}' no existe` });
    }
    data[campo] = req.body[campo];
    writeData(data);
    res.json({ message: `Campo '${campo}' actualizado`, data });
  } catch {
    res.status(500).json({ error: "Error modificando inicio.json" });
  }
});

// PUT /inicio/preguntas_frecuentes/:index
router.put("/preguntas_frecuentes/:index", (req, res) => {
  try {
    const data = readData();
    const idx = parseInt(req.params.index);
    if (!data.preguntas_frecuentes || !data.preguntas_frecuentes[idx]) {
      return res.status(404).json({ error: "Pregunta no encontrada" });
    }
    data.preguntas_frecuentes[idx] = {
      ...data.preguntas_frecuentes[idx],
      ...req.body,
    };
    writeData(data);
    res.json({ message: "Pregunta actualizada", data });
  } catch {
    res.status(500).json({ error: "Error modificando pregunta" });
  }
});

export default router;
