import db from "../config/db.js";

export const obtenerVentasMensuales = async () => {
  return db.execute(`
    SELECT 
      MONTH(fecha) as mes,
      SUM(total) as total_ventas
    FROM venta
    GROUP BY MONTH(fecha)
    ORDER BY mes ASC
    LIMIT 6;
  `);
};
