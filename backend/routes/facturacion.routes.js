import express from "express";
import {
  obtenerFacturas,
  crearFactura,
  actualizarFactura,
  eliminarFactura,
} from "../controllers/facturacion.controller.js";

const router = express.Router();

router.get("/", obtenerFacturas);
router.post("/", crearFactura);
router.put("/:id", actualizarFactura);
router.delete("/:id", eliminarFactura);

export default router;
