import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { enviarCodigoVerificacion } from "../utils/mailer.js";

const router = express.Router();
const JWT_SECRET = "clave_super_secreta";

// Login solo para administradores (usuario es el email)
router.post("/", async (req, res) => {
  const { usuario, contraseña } = req.body;

  if (!usuario || !contraseña) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM admin WHERE usuario = ?", [usuario]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña inválidos" });
    }

    const user = rows[0];

    if (!user.contraseña) {
      return res.status(401).json({ error: "Usuario o contraseña inválidos" });
    }

    const match = await bcrypt.compare(contraseña, user.contraseña);

    if (!match) {
      return res.status(401).json({ error: "Usuario o contraseña inválidos" });
    }

    const token = jwt.sign(
      {
        id_admin: user.id_admin,
        usuario: user.usuario,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id_admin: user.id_admin,
        usuario: user.usuario,
      },
    });
  } catch (error) {
    console.error("Error en Login:", error);
    res.status(500).json({ error: "Error en el login" });
  }
});

// Solicitar cambio de contraseña (envía código por email)
router.post("/changepass", async (req, res) => {
  const { usuario } = req.body;

  if (!usuario) {
    return res.status(400).json({ error: "Falta el usuario" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM admin WHERE usuario = ?", [usuario]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = rows[0];
    const codigoVerif = Math.floor(100000 + Math.random() * 900000).toString();

    await db.query("UPDATE admin SET codigo_verif = ? WHERE id_admin = ?", [codigoVerif, user.id_admin]);

    await enviarCodigoVerificacion(user.usuario, codigoVerif);

    res.json({ mensaje: "Te enviamos un código por email para cambiar la contraseña." });
  } catch (error) {
    console.error("Error en SolicitarCambioContraseña:", error);
    res.status(500).json({ error: "Error al solicitar cambio de contraseña." });
  }
});

// Confirmar código y cambiar contraseña
router.post("/changepassSuccess", async (req, res) => {
  const { usuario, codigo, nuevaContraseña } = req.body;

  if (!usuario || !codigo || !nuevaContraseña) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM admin WHERE usuario = ? AND codigo_verif = ?",
      [usuario, codigo]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Código o usuario incorrecto" });
    }

    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    await db.query(
      "UPDATE admin SET contraseña = ?, codigo_verif = NULL WHERE id_admin = ?",
      [hashedPassword, rows[0].id_admin]
    );

    res.json({ mensaje: "Contraseña cambiada correctamente." });
  } catch (error) {
    console.error("Error en ConfirmarCambioContraseña:", error);
    res.status(500).json({ error: "Error al cambiar la contraseña." });
  }
});

export default router;