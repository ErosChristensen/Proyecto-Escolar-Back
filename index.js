import db from "./db.js"
import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Modificaciones from "./routes/modifications.js";
import Noticias from "./routes/noticias.js";
import Login from "./routes/login.js";
import { swaggerUi, swaggerSpec } from "./swaggerDocs.js";
import AdminNoticias from "./routes/admin.noticias.js";
import RequireAdmin from "./require.admin.js";
import formularioRoutes from "./routes/formulario.js";
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

// Healthcheck arriba de todo (para testear rápido)
app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

// Estáticos (si los usás)
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/api/noticias", Noticias  );
app.use("/api/login", Login );
app.use("/api" , Modificaciones );
app.use("/formulario", formularioRoutes);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "..", "public/uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/admin/noticias", RequireAdmin, AdminNoticias );
// Root
app.get("/", (_req, res) => {
  res.send("Servidor backend funcionando");
});

// 404 al final
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});






