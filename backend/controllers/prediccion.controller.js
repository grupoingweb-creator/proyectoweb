import { obtenerVentasMensuales } from "../models/ventas.model.js";

// ===========================
// FUNCION DE REGRESION LINEAL
// ===========================
const regresionLineal = (valores) => {
  const n = valores.length;
  const x = valores.map((_, i) => i + 1); // 1,2,3,...
  const y = valores;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);

  const divisor = n * sumX2 - sumX * sumX;
  const m = divisor !== 0 ? (n * sumXY - sumX * sumY) / divisor : 0;
  const b = (sumY - m * sumX) / n;

  const siguienteX = n + 1;
  const prediccion = m * siguienteX + b;

  const porcentaje =
    y[y.length - 1] !== 0
      ? ((prediccion - y[y.length - 1]) / y[y.length - 1]) * 100
      : 0;

  return { prediccion, porcentaje };
};

// ===========================
// CONTROLADOR DE PREDICCION
// ===========================
export const obtenerPrediccion = async (req, res) => {
  try {
    let ventas = await obtenerVentasMensuales();

    // Si viene como array anidado [[...]], aplanar
    if (Array.isArray(ventas) && Array.isArray(ventas[0])) {
      ventas = ventas[0];
    }

    // Convertir total_ventas a número
    ventas = ventas.map((v) => ({
      mes: Number(v.mes),
      total_ventas: Number(v.total_ventas),
    }));

    if (!ventas || ventas.length < 2) {
      return res.json({
        historial: ventas || [],
        prediccion: 0,
        porcentaje: 0,
        proximoMes: "Próximo",
        insight: "No hay suficientes datos para generar predicción.",
      });
    }

    const valores = ventas.map((v) => v.total_ventas);
    const { prediccion, porcentaje } = regresionLineal(valores);

    const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    const ultimoMesNum = ventas[ventas.length - 1].mes ?? new Date().getMonth() + 1;
    const proximoMes = meses[ultimoMesNum % 12];

    res.json({
      historial: ventas,
      prediccion: Number(prediccion.toFixed(2)),
      porcentaje: Number(porcentaje.toFixed(1)),
      proximoMes,
      insight: "Proyección generada",
    });
  } catch (error) {
    console.error("❌ Error en obtenerPrediccion:", error);
    res.status(500).json({ msg: "Error al generar predicción" });
  }
};
