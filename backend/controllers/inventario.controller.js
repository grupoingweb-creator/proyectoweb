import db from "../config/db.js";

// ✅ Obtener todos los registros de inventario
export const getInventario = async (req, res) => {
  try {
    const sql = `
      SELECT 
        i.id_inventario,
        p.nombre AS nombre_producto,
        i.cantidad_inicial,
        i.entradas,
        i.salidas,
        i.stock_actual,
        i.fecha_actualizacion
      FROM inventario i
      INNER JOIN producto p ON i.id_producto = p.id_producto
      ORDER BY i.id_inventario ASC
    `;

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener inventario:", error);
    res.status(500).json({ message: "Error al obtener inventario." });
  }
};

// ✅ Obtener un solo registro
export const getInventarioById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        i.id_inventario,
        p.nombre AS nombre_producto,
        i.cantidad_inicial,
        i.entradas,
        i.salidas,
        i.stock_actual,
        i.fecha_actualizacion
      FROM inventario i
      INNER JOIN producto p ON i.id_producto = p.id_producto
      WHERE i.id_inventario = ?
      `,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener el registro:", error);
    res.status(500).json({ message: "Error al obtener el registro." });
  }
};

// ✅ Crear un nuevo registro
export const createInventario = async (req, res) => {
  try {
    const { id_producto, cantidad_inicial, entradas, salidas } = req.body;

    // ⚠️ NO se incluye stock_actual porque se genera automáticamente
    const sql = `
      INSERT INTO inventario (id_producto, cantidad_inicial, entradas, salidas)
      VALUES (?, ?, ?, ?)
    `;

    await db.query(sql, [id_producto, cantidad_inicial, entradas, salidas]);

    res.status(201).json({ message: "✅ Registro creado correctamente." });
  } catch (error) {
    console.error("❌ Error al crear el registro:", error);
    res.status(500).json({ message: "Error al crear el registro." });
  }
};

// ✅ Actualizar un registro existente
export const updateInventario = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad_inicial, entradas, salidas } = req.body;

    // ⚠️ NO incluir stock_actual (lo calcula MySQL automáticamente)
    const [result] = await db.query(
      `
      UPDATE inventario 
      SET cantidad_inicial = ?, entradas = ?, salidas = ?, fecha_actualizacion = NOW()
      WHERE id_inventario = ?
      `,
      [cantidad_inicial, entradas, salidas, id]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "✅ Inventario actualizado correctamente." });
    } else {
      res.status(404).json({ message: "❌ Registro no encontrado." });
    }
  } catch (error) {
    console.error("❌ Error al actualizar inventario:", error);
    res.status(500).json({ message: "Error al actualizar registro." });
  }
};

// ✅ Eliminar un registro
export const deleteInventario = async (req, res) => {
  try {
    await db.query("DELETE FROM inventario WHERE id_inventario = ?", [
      req.params.id,
    ]);
    res.json({ message: "🗑️ Registro eliminado correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar registro:", error);
    res.status(500).json({ message: "Error al eliminar registro." });
  }
};
