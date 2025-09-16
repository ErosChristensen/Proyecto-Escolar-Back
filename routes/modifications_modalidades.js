// routes/modifications_modalidades.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const filePath = path.resolve("content/modalidades.json");

const readData = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const writeData = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

// GET /modalidades
router.get("/", (req, res) => {
  try {
    res.json(readData());
  } catch {
    res.status(500).json({ error: "Error leyendo modalidades.json" });
  }
});

// PUT /modalidades
router.put("/", (req, res) => {
  try {
    writeData(req.body);
    res.json({ message: "Modalidades reemplazadas", data: req.body });
  } catch {
    res.status(500).json({ error: "Error guardando modalidades.json" });
  }
});

// PATCH /modalidades/:campo
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
    res.status(500).json({ error: "Error modificando modalidades.json" });
  }
});

// PUT /modalidades/modalidad_1/:index
router.put("/modalidad_1/:index", (req, res) => {
  try {
    const data = readData();
    const idx = parseInt(req.params.index);
    if (!data.modalidad_1 || !data.modalidad_1[idx]) {
      return res.status(404).json({ error: "Ítem no encontrado en modalidad_1" });
    }
    data.modalidad_1[idx] = { ...data.modalidad_1[idx], ...req.body };
    writeData(data);
    res.json({ message: "Modalidad_1 actualizada", data });
  } catch {
    res.status(500).json({ error: "Error modificando modalidad_1" });
  }
});

// PUT /modalidades/modalidad_2/:index
router.put("/modalidad_2/:index", (req, res) => {
  try {
    const data = readData();
    const idx = parseInt(req.params.index);
    if (!data.modalidad_2 || !data.modalidad_2[idx]) {
      return res.status(404).json({ error: "Ítem no encontrado en modalidad_2" });
    }
    data.modalidad_2[idx] = { ...data.modalidad_2[idx], ...req.body };
    writeData(data);
    res.json({ message: "Modalidad_2 actualizada", data });
  } catch {
    res.status(500).json({ error: "Error modificando modalidad_2" });
  }
});

export default router;
