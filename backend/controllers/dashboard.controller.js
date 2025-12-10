import db from "../config/db.js";

// =====================
// OBTENER DATOS DEL DASHBOARD
// =====================
export const obtenerDashboard = async (req, res) => {
  try {
    // Ventas Totales
    const [ventas] = await db.query("SELECT SUM(total) AS ventasTotales FROM venta");
    const ventasTotales = ventas[0].ventasTotales || 0;

    // Clientes Nuevos (solo contamos todos los usuarios)
    const [clientes] = await db.query("SELECT COUNT(*) AS clientesNuevos FROM usuario");
    const clientesNuevos = clientes[0].clientesNuevos || 0;

    // Productos en Stock (solo contamos productos existentes)
    const [productos] = await db.query("SELECT COUNT(*) AS stockTotal FROM producto");
    const stockTotal = productos[0].stockTotal || 0;

    res.json({
      ventasTotales,
      clientesNuevos,
      stockTotal
    });
  } catch (error) {
    console.error("Error al obtener dashboard:", error);
    res.status(500).json({ ok: false, msg: "Error al obtener dashboard" });
  }
};
