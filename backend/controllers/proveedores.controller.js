import db from "../config/db.js";

// 🟢 Obtener todos los proveedores
export const obtenerProveedores = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM proveedor ORDER BY id_proveedor DESC");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener proveedores:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Crear un nuevo proveedor
export const crearProveedor = async (req, res) => {
  try {
    console.log("📥 Datos recibidos:", req.body);
    const { nombre, ruc, telefono, correo, direccion } = req.body;

    const sql = `
      INSERT INTO proveedor (nombre, razon_social, ruc, telefono, correo, direccion, fecha_registro)
      VALUES (?, NULL, ?, ?, ?, ?, NOW())
    `;

    const [result] = await db.query(sql, [nombre, ruc, telefono, correo, direccion]);
    console.log("✅ Proveedor insertado con ID:", result.insertId);

    res.status(201).json({ mensaje: "✅ Proveedor registrado correctamente" });
  } catch (error) {
    console.error("❌ Error al crear proveedor:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Actualizar proveedor
export const actualizarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, ruc, telefono, correo, direccion } = req.body;
    const sql = `
      UPDATE proveedor
      SET nombre=?, ruc=?, telefono=?, correo=?, direccion=?
      WHERE id_proveedor=?
    `;
    await db.query(sql, [nombre, ruc, telefono, correo, direccion, id]);
    res.json({ mensaje: "Proveedor actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar proveedor:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🟢 Eliminar proveedor
export const eliminarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM proveedor WHERE id_proveedor=?", [id]);
    res.json({ mensaje: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar proveedor:", error);
    res.status(500).json({ error: error.message });
  }
};
