// routes/index.js
import express from "express";
import noticiasRouter from "./Modificaciones_noticias.js";
import modalidadesRouter from "./Modificaciones_modalidades.js";
import historiaRouter from "./Modificaciones_historia.js";
import inicioRouter from "./Modificaciones_inicio.js";

const router = express.Router();

router.use("/noticias", noticiasRouter);
router.use("/modalidades", modalidadesRouter);
router.use("/historia", historiaRouter);
router.use("/inicio", inicioRouter);

export default router;

