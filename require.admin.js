//requireAdmin.js
import jwt from "jsonwebtoken";

/**
 * Middleware de protección para rutas de admin
 * - Lee Authorization: Bearer <token>
 * - Verifica JWT con process.env.JWT_SECRET
 * - Acepta si el payload tiene isAdmin === true o role === 'admin'
 * - Adjunta req.user con el payload del token
 *
 * Estados:
 * 401 -> falta token / token inválido
 * 403 -> no es admin
 */

export default function requireAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization || "";

    // Permite desactivar auth en local si seteás DISABLE_AUTH=true en .env (opcional)
    if (process.env.DISABLE_AUTH === "true") {
      req.user = { id: 0, email: "dev@local", isAdmin: true, role: "admin" };
      return next();
    }

    if (!auth.startsWith("Bearer ")) {
      return res.status(401).json({ ok: false, error: "Falta token Bearer en Authorization" });
    }

    const token = auth.slice("Bearer ".length).trim();
    if (!token) {
      return res.status(401).json({ ok: false, error: "Token vacío" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ ok: false, error: "Falta JWT_SECRET en el entorno" });
    }

    // Verifica firma y vencimiento
    const payload = jwt.verify(token, secret); // por defecto HS256

    // Chequeo de privilegios de admin
    const isAdmin = payload?.isAdmin === true || String(payload?.role).toLowerCase() === "admin";
    if (!isAdmin) {
      return res.status(403).json({ ok: false, error: "No autorizado: se requiere rol de administrador" });
    }

    // Propaga el usuario para uso en controladores
    req.user = payload;
    next();
  } catch (err) {
    // Errores comunes de JWT
    if (err?.name === "TokenExpiredError") {
      return res.status(401).json({ ok: false, error: "Token expirado" });
    }
    if (err?.name === "JsonWebTokenError") {
      return res.status(401).json({ ok: false, error: "Token inválido" });
    }
    console.error("requireAdmin error:", err);
    return res.status(401).json({ ok: false, error: "No autorizado" });
  }
};
