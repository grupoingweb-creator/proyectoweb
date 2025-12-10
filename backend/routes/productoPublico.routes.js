// src/routes/productoPublico.routes.js
import { Router } from "express";
import { 
  listarProductosPublico,
  crearVentaCliente,
  historialCliente,
  eliminarVenta,
  eliminarVentasUsuario
} from "../controllers/productoPublico.controller.js";

const router = Router();

// Productos activos
router.get("/productos", listarProductosPublico);

// Crear venta desde cliente
router.post("/crear-venta", crearVentaCliente);

// Historial de cliente
router.get("/historial/:id_usuario", historialCliente);

// Eliminar venta individual
router.delete("/venta/:id_venta", eliminarVenta);

// Eliminar todas las ventas del usuario
router.delete("/ventas/:id_usuario", eliminarVentasUsuario);

export default router;
