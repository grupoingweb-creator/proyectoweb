import db from "../config/db.js";

// ✅ Listar todos los clientes
export const obtenerClientes = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cliente ORDER BY id_cliente DESC");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener clientes:", error);
    res.status(500).json({ message: "Error al obtener los clientes." });
  }
};

// ✅ Crear cliente
export const crearCliente = async (req, res) => {
  try {
    const { nombre, telefono, correo, direccion } = req.body;

    // Validación de longitud del teléfono
    if (telefono && telefono.length > 15) {
      return res
        .status(400)
        .json({ message: "El teléfono no puede tener más de 15 caracteres." });
    }

    const sql = `
      INSERT INTO cliente (nombre, telefono, correo, direccion)
      VALUES (?, ?, ?, ?)
    `;
    await db.query(sql, [nombre, telefono, correo, direccion]);

    res.status(201).json({ message: "✅ Cliente registrado correctamente." });
  } catch (error) {
    console.error("❌ Error al crear cliente:", error);
    res.status(500).json({ message: "Error al crear el cliente." });
  }
};

// ✅ Actualizar cliente
export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, correo, direccion, estado } = req.body;

    const sql = `
      UPDATE cliente
      SET nombre = ?, telefono = ?, correo = ?, direccion = ?, estado = ?
      WHERE id_cliente = ?
    `;
    const [result] = await db.query(sql, [
      nombre,
      telefono,
      correo,
      direccion,
      estado,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    res.json({ message: "✅ Cliente actualizado correctamente." });
  } catch (error) {
    console.error("❌ Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar el cliente." });
  }
};

// ✅ Eliminar cliente
export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM cliente WHERE id_cliente = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    res.json({ message: "🗑️ Cliente eliminado correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error al eliminar el cliente." });
  }
};
