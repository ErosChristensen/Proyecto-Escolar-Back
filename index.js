import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import Noticias from "./routes/noticias.js";
import Login from "./routes/login.js";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/api/noticias", Noticias  );
app.use("/api/login", Login );

app.get("/", (req, res) => {
  res.send("Servidor backend funcionando");
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

