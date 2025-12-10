import { Router } from "express";
import { obtenerDashboard } from "../controllers/dashboard.controller.js";
import { obtenerPrediccion } from "../controllers/prediccion.controller.js";

const router = Router();

// Ruta del dashboard general
router.get("/", obtenerDashboard);

// Ruta para predicción de ventas
router.get("/prediccion", obtenerPrediccion);

export default router;
