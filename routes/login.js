import express from "express";
import bcrypt from "bcrypt";
import db from "../db.js";
import { createRequire } from "module";
const jwt = createRequire(import.meta.url)("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "cambia_esto_en_.env";
const JWT_TTL = process.env.JWT_ACCESS_TTL || "15m";

function esEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").toLowerCase());
}

// POST /api/login/
router.post("/", async (req, res) => {
  try {
    const usuario = (req.body?.usuario ?? "").toString().trim().toLowerCase();
    // aceptamos 'contraseña' o 'contrasena' (Windows/PowerShell)
    const contraseña = (req.body?.contraseña ?? req.body?.contrasena ?? "").toString();

    if (!esEmail(usuario) || contraseña.length < 8) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

const [rows] = await db.query(
  "SELECT id_admin, usuario, nombre, `contraseña` AS hash, disabled FROM admin WHERE LOWER(usuario) = LOWER(?)",
  [usuario]
);

    if (!rows.length) {
      return res.status(401).json({ error: "Usuario o contraseña inválidos" });
    }
const user = rows[0];

const hash =
  (typeof user.hash === "string" && user.hash.length ? user.hash : null) ??
  (typeof user["contraseña"] === "string" && user["contraseña"].length ? user["contraseña"] : null);

if (!hash) {
  console.error("[LOGIN] contraseña NULL/vacía en DB para", usuario);
  return res.status(401).json({ error: "Usuario o contraseña inválidos" });
}

    const ok = await bcrypt.compare(contraseña, hash);
    if (!ok) {
      return res.status(401).json({ error: "Usuario o contraseña inválidos" });
    }

    if (user.disabled === 1) {
      return res.status(403).json({ error: "Cuenta deshabilitada" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("[LOGIN] FALTA JWT_SECRET en .env");
      return res.status(500).json({ error: "Config faltante: JWT_SECRET" });
    }

    const token = jwt.sign(
      { sub: user.id_admin ?? user.id ?? user.usuario, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: JWT_TTL }
    );

    return res.json({
      token,
      admin: {
        id_admin: user.id_admin ?? user.id,
        usuario: user.usuario,
        nombre: user.nombre ?? null,
        role: "admin"
      }
    });
  } catch (e) {
    console.error("[LOGIN] 500:", e);
    return res.status(500).json({ error: "Error en el login" });
  }
});

export default router;
