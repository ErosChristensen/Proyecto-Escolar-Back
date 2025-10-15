import express from "express";
import modalidadesRouter from "./modifications_modalidades.js";
import historiaRouter from "./modifications_historia.js";
import inicioRouter from "./modifications_inicio.js";

const router = express.Router();

router.use("/modalidades", modalidadesRouter);
router.use("/historia", historiaRouter);
router.use("/inicio", inicioRouter);

export default router;

