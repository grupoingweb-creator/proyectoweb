import express from "express";
import {
  obtenerCompras,
  crearCompra,
  actualizarCompra,
  eliminarCompra,
} from "../controllers/compras.controller.js";

const router = express.Router();

router.get("/", obtenerCompras);
router.post("/", crearCompra);
router.put("/:id", actualizarCompra);
router.delete("/:id", eliminarCompra);

export default router;
