import express from "express";
import {
  obtenerProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor,
} from "../controllers/proveedores.controller.js";

const router = express.Router();

// ✅ Rutas CRUD de proveedores
router.get("/", obtenerProveedores);
router.post("/", crearProveedor);
router.put("/:id", actualizarProveedor);
router.delete("/:id", eliminarProveedor);

export default router;
