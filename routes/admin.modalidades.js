import express from "express";
import fs from "fs";
import path from "path";
import db from "../db.js";

const router = express.Router();
const filePath = path.resolve("content/modalidades.json");

const readData = () => JSON.parse(fs.readFileSync(filePath, "utf-8"));
const writeData = (data) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

// ----------------- 1️⃣ Obtener registros de alumnos -----------------
router.get("/alumnos", async (req, res) => {
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
    console.error("[ERROR GET /admin/modalidades/alumnos]", error);
    res.status(500).json({ error: "Error al obtener los registros de modalidades" });
  }
});

// ----------------- 2️⃣ Obtener modalidades.json completo -----------------
router.get("/json", (req, res) => {
  try {
    res.json(readData());
  } catch {
    res.status(500).json({ error: "Error leyendo modalidades.json" });
  }
});

// ----------------- 3️⃣ Reemplazar todo modalidades.json -----------------
router.put("/json", (req, res) => {
  try {
    writeData(req.body);
    res.json({ message: "Modalidades reemplazadas", data: req.body });
  } catch {
    res.status(500).json({ error: "Error guardando modalidades.json" });
  }
});

// ----------------- 4️⃣ Reemplazar toda modalidad_1 -----------------
router.put("/json/modalidad_1", (req, res) => {
  try {
    const data = readData();
    data.modalidad_1 = req.body; // Reemplaza todo el array
    writeData(data);
    res.json({ message: "Modalidad_1 reemplazada", data });
  } catch {
    res.status(500).json({ error: "Error guardando modalidad_1" });
  }
});

// ----------------- 5️⃣ Reemplazar toda modalidad_2 -----------------
router.put("/json/modalidad_2", (req, res) => {
  try {
    const data = readData();
    data.modalidad_2 = req.body; // Reemplaza todo el array
    writeData(data);
    res.json({ message: "Modalidad_2 reemplazada", data });
  } catch {
    res.status(500).json({ error: "Error guardando modalidad_2" });
  }
});

export default router;
