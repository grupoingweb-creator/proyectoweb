import db from "../config/db.js";

// ✅ Obtener todas las compras con proveedor y totales
export const obtenerCompras = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id_compra,
        p.nombre AS proveedor,
        c.fecha_compra,
        c.total,
        c.estado
      FROM compra c
      LEFT JOIN proveedor p ON c.id_proveedor = p.id_proveedor
      ORDER BY c.id_compra DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener compras:", error);
    res.status(500).json({ error: "Error al obtener compras" });
  }
};

// ✅ Crear una nueva compra
export const crearCompra = async (req, res) => {
  const { id_proveedor, fecha_compra, total, estado } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO compra (id_proveedor, fecha_compra, total, estado) VALUES (?, ?, ?, ?)`,
      [id_proveedor, fecha_compra, total, estado || "Recibido"]
    );
    res.json({ mensaje: "✅ Compra registrada correctamente.", id: result.insertId });
  } catch (error) {
    console.error("Error al registrar compra:", error);
    res.status(500).json({ error: "Error al registrar compra" });
  }
};

// ✅ Actualizar compra
export const actualizarCompra = async (req, res) => {
  const { id } = req.params;
  const { id_proveedor, fecha_compra, total, estado } = req.body;
  try {
    await db.query(
      `UPDATE compra SET id_proveedor=?, fecha_compra=?, total=?, estado=? WHERE id_compra=?`,
      [id_proveedor, fecha_compra, total, estado, id]
    );
    res.json({ mensaje: "✅ Compra actualizada correctamente." });
  } catch (error) {
    console.error("Error al actualizar compra:", error);
    res.status(500).json({ error: "Error al actualizar compra" });
  }
};

// ✅ Eliminar compra
export const eliminarCompra = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM compra WHERE id_compra = ?`, [id]);
    res.json({ mensaje: "🗑️ Compra eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar compra:", error);
    res.status(500).json({ error: "Error al eliminar compra" });
  }
};
