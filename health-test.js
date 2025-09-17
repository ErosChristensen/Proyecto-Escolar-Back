import express from "express";
const app = express();
const PORT = 3000;

app.get("/health", (_req, res) => res.status(200).json({ ok: true, source: "health-test.js" }));
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada (health-test.js)" }));

app.listen(PORT, () => console.log(`health-test.js escuchando en ${PORT}`));
