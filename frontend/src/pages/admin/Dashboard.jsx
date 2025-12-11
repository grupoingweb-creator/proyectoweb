import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { FaRobot } from "react-icons/fa";
import axios from "axios";

// =======================
// API
// =======================
const getPrediccion = async () => {
  const { data } = await axios.get("http://localhost:4000/api/dashboard/prediccion");
  return data;
};

const getDashboardData = async () => {
  const { data } = await axios.get("http://localhost:4000/api/dashboard");
  return data;
};

// =======================
// Nombres de meses
// =======================
const nombresMeses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

// =======================
// COMPONENTE PRINCIPAL
// =======================
function Dashboard() {
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [prediccion, setPrediccion] = useState(null);
  const [dashboard, setDashboard] = useState({
    ventasTotales: 0,
    clientesNuevos: 0,
    stockTotal: 0,
  });

  useEffect(() => {
    cargarDatos();
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      const data = await getDashboardData();
      setDashboard(data);
    } catch (error) {
      console.error("❌ Error cargando dashboard:", error);
    }
  };

  const cargarDatos = async () => {
    try {
      const pred = await getPrediccion();
      setVentasMensuales(pred.historial); // historial ya es array plano
      setPrediccion(pred);
    } catch (error) {
      console.error("❌ Error cargando predicción:", error);
    }
  };

  // 🔹 Datos para el gráfico con meses convertidos a nombres
  const datosGrafico = [
    ...ventasMensuales.map(v => ({
      mes: nombresMeses[(v.mes - 1) % 12],
      total: Number(v.total_ventas),
    })),
    prediccion && { mes: prediccion.proximoMes, total: prediccion.prediccion },
  ].filter(Boolean);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-red-700 mb-6">Panel General</h1>
      <p className="text-gray-600 mb-8">
        Bienvenido al sistema de gestión de ventas de{" "}
        <strong>FIAMBRERÍA PERÚ S.A.C.</strong>
      </p>

      {/* === TARJETAS === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Tarjeta titulo="Ventas Totales" valor={`S/ ${dashboard.ventasTotales}`} />
        <Tarjeta titulo="Clientes Nuevos" valor={`+${dashboard.clientesNuevos}`} />
        <Tarjeta titulo="Productos en Stock" valor={dashboard.stockTotal} />
      </div>

      {/* === GRÁFICO DE PREDICCIÓN === */}
      <div className="bg-white p-6 rounded-xl shadow-2xl border">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <FaRobot className="text-blue-600" /> Proyección de Ventas
        </h3>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={datosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#dc2626"
              strokeWidth={3}
              name="Historial"
            />
          </LineChart>
        </ResponsiveContainer>

        <BloquePrediccion pred={prediccion} />
      </div>
    </div>
  );
}

export default Dashboard;

// =======================
// COMPONENTES AUXILIARES
// =======================
function Tarjeta({ titulo, valor }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
      <h2 className="text-gray-500 text-sm">{titulo}</h2>
      <p className="text-2xl font-bold text-red-600">{valor}</p>
    </div>
  );
}

function BloquePrediccion({ pred }) {
  if (!pred) {
    return (
      <div className="mt-4 bg-gray-50 rounded-lg p-4 text-center border">
        <p className="text-gray-500">⏳ Cargando proyección...</p>
      </div>
    );
  }

  return (
    <>
      {pred.insight && (
        <div className="mt-4 bg-white rounded-lg p-5 shadow border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-700 mb-2">
            🤖 Proyección de Ventas
          </h4>
          <p className="text-gray-700">{pred.insight}</p>
        </div>
      )}

      <div className="mt-4 bg-gray-50 rounded-lg p-4 text-center border shadow-sm">
        <p className="text-gray-700 text-sm mb-2">🔮 Proyección del próximo mes:</p>

        <p className="text-3xl font-extrabold text-blue-600">
          S/ {(pred.prediccion ?? 0).toFixed(2)}
        </p>

        <p
          className={`mt-2 text-lg font-semibold ${
            pred.porcentaje >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {pred.porcentaje >= 0
            ? `📈 Aumento del ${(pred.porcentaje ?? 0).toFixed(1)}%`
            : `📉 Caída del ${Math.abs(pred.porcentaje ?? 0).toFixed(1)}%`}
        </p>
      </div>
    </>
  );
}
