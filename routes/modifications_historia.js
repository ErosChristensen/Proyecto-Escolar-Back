// routes/modifications_historia.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const filePath = path.resolve("content/historia.json");

// Helper
const readData = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const writeData = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

// GET /historia → trae todo
router.get("/", (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error leyendo historia.json" });
  }
});

// PUT /historia → reemplaza todo el JSON
router.put("/", (req, res) => {
  try {
    writeData(req.body);
    res.json({ message: "Historia reemplazada con éxito", data: req.body });
  } catch (err) {
    res.status(500).json({ error: "Error guardando historia.json" });
  }
});

// PATCH /historia/:campo → actualiza un campo plano
router.patch("/:campo", (req, res) => {
  try {
    const data = readData();
    const { campo } = req.params;
    if (!(campo in data)) {
      return res.status(400).json({ error: `El campo '${campo}' no existe` });
    }
    data[campo] = req.body[campo];
    writeData(data);
    res.json({ message: `Campo '${campo}' actualizado`, data });
  } catch (err) {
    res.status(500).json({ error: "Error modificando historia.json" });
  }
});

// PUT /historia/autoridades/:index → editar autoridad
router.put("/autoridades/:index", (req, res) => {
  try {
    const data = readData();
    const idx = parseInt(req.params.index);
    if (!data.autoridades || !data.autoridades[idx]) {
      return res.status(404).json({ error: "Autoridad no encontrada" });
    }
    data.autoridades[idx] = { ...data.autoridades[idx], ...req.body };
    writeData(data);
    res.json({ message: "Autoridad actualizada", data });
  } catch (err) {
    res.status(500).json({ error: "Error modificando autoridad" });
  }
});

// PUT /historia/talleres/:index → editar taller
router.put("/talleres/:index", (req, res) => {
  try {
    const data = readData();
    const idx = parseInt(req.params.index);
    if (!data.talleres || !data.talleres[idx]) {
      return res.status(404).json({ error: "Taller no encontrado" });
    }
    data.talleres[idx] = { ...data.talleres[idx], ...req.body };
    writeData(data);
    res.json({ message: "Taller actualizado", data });
  } catch (err) {
    res.status(500).json({ error: "Error modificando taller" });
  }
});

export default router;
