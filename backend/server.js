import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";

// Rutas existentes
import clienteRoutes from "./routes/clientes.routes.js";
import proveedorRoutes from "./routes/proveedores.routes.js";
import inventarioRoutes from "./routes/inventario.routes.js";
import productosRoutes from "./routes/productos.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import facturasRoutes from "./routes/facturacion.routes.js";
import compraRoutes from "./routes/compras.routes.js";
import reportesRoutes from "./routes/reportes.routes.js";
import prediccionRoutes from "./routes/prediccion.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import productoPublicoRoutes from "./routes/productoPublico.routes.js";
// ✅ Nueva ruta de usuarios
import usuarioRoutes from "./routes/usuario.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // frontend
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(express.json()); // importante para leer req.body

// Rutas existentes
app.use("/api/clientes", clienteRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/facturacion", facturasRoutes);
app.use("/api/compras", compraRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/prediccion", prediccionRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ Ruta para usuarios
app.use("/api/usuario", usuarioRoutes);
app.use("/api/publico", productoPublicoRoutes);
// Ruta raíz
app.get("/", (req, res) => {
  res.send("🚀 Servidor backend de FIAMBRERÍA PERÚ S.A.C. funcionando correctamente");
});

// Manejo de errores simples
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, msg: "Error interno del servidor" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
