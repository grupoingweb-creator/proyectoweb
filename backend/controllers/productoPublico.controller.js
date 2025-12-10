// src/controllers/productoPublico.controller.js
import db from "../config/db.js";

// =====================
// LISTAR PRODUCTOS ACTIVOS
// =====================
export const listarProductosPublico = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id_producto,
        nombre,
        descripcion,
        categoria,
        precio_venta,
        estado
      FROM producto 
      WHERE estado = 'Activo'
    `);

    res.json({ ok: true, productos: rows });
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.json({ ok: false, msg: "Error al listar productos" });
  }
};

// =====================
// CREAR VENTA DESDE CLIENTE
// =====================
export const crearVentaCliente = async (req, res) => {
  const { id_usuario, metodo_pago, productos } = req.body;

  if (!id_usuario || !productos || productos.length === 0) {
    return res.json({ ok: false, msg: "Datos incompletos para registrar la venta" });
  }

  try {
    const total = productos.reduce((acc, p) => acc + p.precio_venta * p.cantidad, 0);

    const [ventaResult] = await db.query(
      "INSERT INTO venta (id_usuario, fecha, total, metodo_pago, estado) VALUES (?, NOW(), ?, ?, 'Pendiente')",
      [id_usuario, total, metodo_pago]
    );

    const id_venta = ventaResult.insertId;

    for (const item of productos) {
      await db.query(
        "INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
        [id_venta, item.id_producto, item.cantidad, item.precio_venta]
      );
    }

    const [ventaCreada] = await db.query(
      "SELECT * FROM venta WHERE id_venta = ?",
      [id_venta]
    );

    res.json({
      ok: true,
      msg: "Venta registrada correctamente",
      venta: ventaCreada[0]
    });
  } catch (error) {
    console.error("Error al crear venta:", error);
    res.json({ ok: false, msg: "Error al registrar venta" });
  }
};

// =====================
// HISTORIAL DEL CLIENTE
// =====================
export const historialCliente = async (req, res) => {
  const { id_usuario } = req.params;

  try {
    const [ventas] = await db.query(
      "SELECT * FROM venta WHERE id_usuario = ? ORDER BY fecha DESC",
      [id_usuario]
    );

    const historial = [];

    for (const venta of ventas) {
      const [productos] = await db.query(
        `SELECT p.id_producto, p.nombre, dv.cantidad, dv.precio_unitario AS precio_venta
         FROM detalle_venta dv
         JOIN producto p ON dv.id_producto = p.id_producto
         WHERE dv.id_venta = ?`,
        [venta.id_venta]
      );

      historial.push({ ...venta, productos });
    }

    res.json({ ok: true, historial });
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.json({ ok: false, msg: "Error al obtener historial" });
  }
};

// =====================
// ELIMINAR VENTA INDIVIDUAL
// =====================
export const eliminarVenta = async (req, res) => {
  const id_venta = Number(req.params.id_venta);
  if (!id_venta) return res.json({ ok: false, msg: "ID de venta inválido" });

  try {
    await db.query("DELETE FROM detalle_venta WHERE id_venta = ?", [id_venta]);
    await db.query("DELETE FROM venta WHERE id_venta = ?", [id_venta]);

    res.json({ ok: true, msg: "Pedido eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar venta:", error);
    res.json({ ok: false, msg: "Error al eliminar el pedido" });
  }
};

// =====================
// ELIMINAR TODAS LAS VENTAS DE UN USUARIO
// =====================
export const eliminarVentasUsuario = async (req, res) => {
  const id_usuario = Number(req.params.id_usuario);
  if (!id_usuario) return res.json({ ok: false, msg: "ID de usuario inválido" });

  try {
    const [ventas] = await db.query("SELECT id_venta FROM venta WHERE id_usuario = ?", [id_usuario]);

    for (const v of ventas) {
      await db.query("DELETE FROM detalle_venta WHERE id_venta = ?", [v.id_venta]);
    }

    await db.query("DELETE FROM venta WHERE id_usuario = ?", [id_usuario]);

    res.json({ ok: true, msg: "Todos los pedidos eliminados correctamente" });
  } catch (error) {
    console.error("Error al eliminar todas las ventas:", error);
    res.json({ ok: false, msg: "Error al eliminar todos los pedidos" });
  }
};
