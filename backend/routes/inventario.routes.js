import express from "express";
import {
  getInventario,
  getInventarioById,
  createInventario,
  updateInventario,
  deleteInventario,
} from "../controllers/inventario.controller.js";

const router = express.Router();

// Rutas principales
router.get("/", getInventario);
router.get("/:id", getInventarioById);
router.post("/", createInventario);
router.put("/:id", updateInventario);
router.delete("/:id", deleteInventario);

export default router;
