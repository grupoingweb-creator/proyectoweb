import { Router } from "express";
import { obtenerReportes } from "../controllers/reportes.controller.js";

const router = Router();

router.get("/", obtenerReportes);

export default router;
