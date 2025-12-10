import { Router } from "express";
import {
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuario,
  obtenerUsuarios
} from "../controllers/usuario.controller.js";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

const router = Router();

// Crear usuario
router.post("/", crearUsuario);

// Login
router.post("/login", async (req, res) => {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena)
    return res.status(400).json({ ok: false, msg: "Completa ambos campos" });

  try {
    const [rows] = await db.query("SELECT * FROM usuario WHERE correo = ?", [correo]);
    if (rows.length === 0)
      return res.status(404).json({ ok: false, msg: "Usuario no registrado" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) return res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });

    res.json({
      ok: true,
      user: { id: user.id_usuario, nombre: user.nombre, correo: user.correo, rol: user.rol },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
});

// ⭐ PONER ESTA RUTA ARRIBA PARA QUE NO CAIGA EN "/:id"
router.get("/usuarios", obtenerUsuarios);

// Obtener usuario por id
router.get("/:id", obtenerUsuario);

// Actualizar usuario
router.put("/:id", actualizarUsuario);

// Eliminar usuario
router.delete("/:id", eliminarUsuario);

export default router;
