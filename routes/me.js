// routes/me.js
import express from "express";
import verificarToken from "../middlewares/auth.js"; // el middleware que ya vimos
const router = express.Router();

router.get("/", verificarToken, (req, res) => {
  // req.user viene del token (sub y role)
  return res.json({ admin: { id_admin: req.user.sub, role: req.user.role } });
});

export default router;
