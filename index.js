import db from "./db.js"
import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Modificaciones from "./routes/modifications.js";
import Noticias from "./routes/noticias.js";
import Login from "./routes/login.js";
import AdminNoticias from "./routes/admin.noticias.js";
import RequireAdmin from "./require.admin.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS (desde .env, o todos si no está definido)
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",").map(s => s.trim()) || "*",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));



// Estáticos (si los usás)
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/api/noticias", Noticias  );
app.use("/api/login", Login );
app.use("/api" , Modificaciones );


//MODALIDADES

// Ruta de elección de modalidad (agregada)
app.post("/api/elegir-modalidad", (req, res) => {
  const { estudianteId, modalidad } = req.body;

  // Validar modalidad
  if (modalidad !== "programacion" && modalidad !== "electronica") {
    return res.status(400).json({
      message: "Modalidad no válida. Debe ser 'programacion' o 'electronica'.",
    });
  }

  console.log(`El estudiante con ID ${estudianteId} eligió la modalidad: ${modalidad}`);

  res.status(200).json({ message: "Modalidad elegida correctamente" });
});
















app.use("/api/admin/noticias", RequireAdmin, AdminNoticias );

// Root
app.get("/", (_req, res) => {
  res.send("Servidor backend funcionando");
});
app.get("/debug/db", async (_req, res) => {
  try {
    const [r] = await db.query("SELECT DATABASE() AS db");
    res.json({ database: r[0]?.db || null });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

// 404 al final
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});






