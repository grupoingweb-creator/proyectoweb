// backend/routes/login.routes.js
import express from "express";
import db from "../config/db.js";

const router = express.Router();

// POST /api/login
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, msg: "Completa ambos campos" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM usuario WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length > 0) {
      res.json({ ok: true, user: rows[0] });
    } else {
      res.status(401).json({ ok: false, msg: "Usuario o contraseña incorrectos" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: "Error del servidor" });
  }
});

export default router;
