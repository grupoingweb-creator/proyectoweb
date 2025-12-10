import db from "../config/db.js";
import bcrypt from "bcryptjs";

// Crear usuario
export const crearUsuario = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;
  try {
    const [existing] = await db.query("SELECT * FROM usuario WHERE correo = ?", [correo]);
    if (existing.length > 0) {
      return res.status(400).json({ ok: false, msg: "El correo ya está registrado" });
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const [result] = await db.query(
      "INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES (?, ?, ?, 'Cliente')",
      [nombre, correo, hash]
    );

    res.json({ ok: true, user: { id: result.insertId, nombre, correo, rol: "Cliente" } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};

// Login usuario
export const loginUsuario = async (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena)
    return res.status(400).json({ ok: false, msg: "Completa ambos campos" });

  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE correo = ?", [correo]);
    if (rows.length === 0) return res.status(404).json({ ok: false, msg: "Usuario no registrado" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) return res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });

    res.json({
      ok: true,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol || "Cliente",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};

// Obtener usuario por id
export const obtenerUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT id_usuario AS id, nombre, correo, rol FROM usuario WHERE id_usuario = ?",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });

    res.json({ ok: true, user: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};

// Actualizar usuario
export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo } = req.body;

  try {
    const [currentUser] = await db.query("SELECT * FROM usuario WHERE id_usuario = ?", [id]);
    if (currentUser.length === 0) return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });

    if (correo !== currentUser[0].correo) {
      const [existing] = await db.query(
        "SELECT * FROM usuario WHERE correo = ? AND id_usuario != ?",
        [correo, id]
      );
      if (existing.length > 0) return res.status(400).json({ ok: false, msg: "El correo ya está en uso" });
    }

    await db.query("UPDATE usuario SET nombre = ?, correo = ? WHERE id_usuario = ?", [nombre, correo, id]);
    const [updated] = await db.query(
      "SELECT id_usuario AS id, nombre, correo, rol FROM usuario WHERE id_usuario = ?",
      [id]
    );

    res.json({ ok: true, msg: "Usuario actualizado correctamente", user: updated[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const [currentUser] = await db.query("SELECT * FROM usuario WHERE id_usuario = ?", [id]);
    if (currentUser.length === 0) return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });

    await db.query("DELETE FROM usuario WHERE id_usuario = ?", [id]);
    res.json({ ok: true, msg: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id_usuario AS id, nombre, correo, rol FROM usuario"
    );

    res.json({ ok: true, usuarios: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
};
