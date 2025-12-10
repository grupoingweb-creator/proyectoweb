import { Router } from "express";
import { obtenerPrediccion } from "../controllers/prediccion.controller.js";

const router = Router();

// Ruta: /api/dashboard/prediccion
router.get("/prediccion", obtenerPrediccion);

export default router;
