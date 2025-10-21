import express from "express";
import historiaRouter from "./modifications_historia.js";
import inicioRouter from "./modifications_inicio.js";

const router = express.Router();

router.use("/historia", historiaRouter);
router.use("/inicio", inicioRouter);

export default router;

