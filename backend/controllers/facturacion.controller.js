import db from "../config/db.js";


// ✅ Obtener todas las facturas con datos de venta y cliente
export const obtenerFacturas = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        f.id_factura,
        f.numero_factura,
        f.fecha_emision,
        f.tipo_documento,
        f.monto_total,
        f.id_venta,
        c.nombre AS cliente
      FROM factura f
      LEFT JOIN venta v ON f.id_venta = v.id_venta
      LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
      ORDER BY f.id_factura DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener facturas:", error);
    res.status(500).json({ error: "Error al obtener facturas" });
  }
};
// 🔹 Crear factura
// 🔹 Crear factura
export const crearFactura = async (req, res) => {
  const { id_venta, numero_factura, fecha_emision, tipo_documento, monto_total } = req.body;

  const sql = `
    INSERT INTO factura (id_venta, numero_factura, fecha_emision, tipo_documento, monto_total)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    await db.query(sql, [id_venta, numero_factura, fecha_emision, tipo_documento, monto_total]);
    res.json({ mensaje: "✅ Factura registrada correctamente." });
  } catch (error) {
    console.error("Error al crear factura:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "❌ El número de factura ya existe." });
    }

    res.status(500).json({ error: "Error al registrar factura." });
  }
};

// 🔹 Actualizar factura
export const actualizarFactura = (req, res) => {
  const { id } = req.params;
  const { numero_factura, fecha_emision, tipo_documento, monto_total } = req.body;

  const sql = `
    UPDATE factura 
    SET numero_factura=?, fecha_emision=?, tipo_documento=?, monto_total=?
    WHERE id_factura=?
  `;

  db.query(sql, [numero_factura, fecha_emision, tipo_documento, monto_total, id], (err) => {
    if (err) {
      console.error("Error al actualizar factura:", err);
      return res.status(500).json({ error: "Error al actualizar factura" });
    }
    res.json({ mensaje: "Factura actualizada correctamente" });
  });
};

// 🔹 Eliminar factura
export const eliminarFactura = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM factura WHERE id_factura=?", [id], (err) => {
    if (err) {
      console.error("Error al eliminar factura:", err);
      return res.status(500).json({ error: "Error al eliminar factura" });
    }
    res.json({ mensaje: "Factura eliminada correctamente" });
  });
};
