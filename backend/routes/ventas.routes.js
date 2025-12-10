import express from "express";
import {
  historialCliente,
  crearVentaCliente,
  eliminarVenta,
  eliminarVentasUsuario,
  listarVentasAdmin,
  actualizarEstadoVenta, // <- importar
} from "../controllers/ventas.controller.js";

const router = express.Router();

// ===============================
// LISTAR TODAS LAS VENTAS (ADMIN)
// ===============================
router.get("/admin", listarVentasAdmin);
// ===============================
// LISTAR HISTORIAL DE UN CLIENTE
// ===============================
router.get("/cliente/:id_usuario", historialCliente);
router.put("/:id_venta", actualizarEstadoVenta);
// ===============================
// REGISTRAR UNA VENTA (CLIENTE)
// ===============================
router.post("/", crearVentaCliente);

// ===============================
// ELIMINAR VENTA INDIVIDUAL
// ===============================
router.delete("/:id_venta", eliminarVenta);

// ===============================
// ELIMINAR TODAS LAS VENTAS DE UN USUARIO
// ===============================
router.delete("/usuario/:id_usuario", eliminarVentasUsuario);

export default router;
