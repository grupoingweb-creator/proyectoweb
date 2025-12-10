import db from "../config/db.js";

// 📊 Obtener resumen general de reportes
export const obtenerReportes = async (req, res) => {
  try {
    // 🔹 Ingresos: total de ventas
    const [ventas] = await db.query(
      "SELECT IFNULL(SUM(total),0) AS total_ventas FROM venta"
    );

    // 🔹 Egresos: total de compras
    const [compras] = await db.query(
      "SELECT IFNULL(SUM(total),0) AS total_compras FROM compra"
    );

    // 🔹 Utilidad: diferencia entre ventas y compras
    const utilidad = ventas[0].total_ventas - compras[0].total_compras;

    // 🔹 Productos más vendidos
    const [productos] = await db.query(`
      SELECT p.nombre AS producto, SUM(dv.cantidad) AS total_vendido
      FROM detalle_venta dv
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      GROUP BY p.nombre
      ORDER BY total_vendido DESC
      LIMIT 5
    `);

    // 🔹 Ventas mensuales (usa campo fecha)
    const [ventasMensuales] = await db.query(`
      SELECT 
        MONTH(fecha) AS mes_numero,
        MONTHNAME(fecha) AS mes,
        SUM(total) AS total
      FROM venta
      WHERE YEAR(fecha) = YEAR(CURDATE())
      GROUP BY mes_numero, mes
      ORDER BY mes_numero
    `);

    // 🔹 Compras mensuales (usa campo fecha_compra)
    const [comprasMensuales] = await db.query(`
      SELECT 
        MONTH(fecha_compra) AS mes_numero,
        MONTHNAME(fecha_compra) AS mes,
        SUM(total) AS total
      FROM compra
      WHERE YEAR(fecha_compra) = YEAR(CURDATE())
      GROUP BY mes_numero, mes
      ORDER BY mes_numero
    `);

   const [clientes] = await db.query(`
  SELECT 
    MONTH(fecha_registro) AS mes_numero,
    MONTHNAME(fecha_registro) AS mes,
    COUNT(*) AS total
  FROM cliente
  WHERE YEAR(fecha_registro) = YEAR(CURDATE())
  GROUP BY mes_numero, mes
  ORDER BY mes_numero
`);


    res.json({
      ingresos: ventas[0].total_ventas,
      egresos: compras[0].total_compras,
      utilidad,
      productos,
      ventasMensuales,
      comprasMensuales,
      clientes,
    });
  } catch (error) {
    console.error("❌ Error obteniendo reportes:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
