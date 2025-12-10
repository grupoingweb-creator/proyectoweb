import db from "../config/db.js";

// ✅ Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM producto ORDER BY id_producto ASC");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos." });
  }
};

// ✅ Obtener un producto por ID
export const getProductoById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM producto WHERE id_producto = ?", [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Producto no encontrado." });
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener producto." });
  }
};

// ✅ Crear un nuevo producto
export const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, categoria, precio_compra, precio_venta, stock, id_proveedor } = req.body;
    const sql = `
      INSERT INTO producto (nombre, descripcion, categoria, precio_compra, precio_venta, stock, id_proveedor)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [nombre, descripcion, categoria, precio_compra, precio_venta, stock, id_proveedor]);
    res.status(201).json({ message: "✅ Producto creado correctamente." });
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    res.status(500).json({ message: "Error al crear producto." });
  }
};

// ✅ Actualizar un producto
export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, categoria, precio_compra, precio_venta, stock, id_proveedor } = req.body;

    const [result] = await db.query(
      `UPDATE producto SET nombre=?, descripcion=?, categoria=?, precio_compra=?, precio_venta=?, stock=?, id_proveedor=? 
       WHERE id_producto=?`,
      [nombre, descripcion, categoria, precio_compra, precio_venta, stock, id_proveedor, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Producto no encontrado." });

    res.json({ message: "✅ Producto actualizado correctamente." });
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar producto." });
  }
};

// ✅ Eliminar producto
export const deleteProducto = async (req, res) => {
  try {
    await db.query("DELETE FROM producto WHERE id_producto = ?", [req.params.id]);
    res.json({ message: "🗑️ Producto eliminado correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto." });
  }
};
