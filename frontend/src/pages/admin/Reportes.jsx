import React, { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaChartBar, FaChartPie, FaDownload } from "react-icons/fa";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Reportes() {
  const [data, setData] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const reporteRef = useRef();
  const COLORS = ["#ef4444", "#facc15", "#22c55e", "#3b82f6", "#8b5cf6"];

  useEffect(() => {
    const cargarReportes = async () => {
      try {
        const [resReportes, resUsuarios] = await Promise.all([
          fetch("http://localhost:4000/api/reportes"),
          fetch("http://localhost:4000/api/usuario/usuarios"),
        ]);

        if (!resReportes.ok) throw new Error("Error al obtener reportes");

        const jsonReportes = await resReportes.json();
        setData(jsonReportes);

        if (resUsuarios.ok) {
          const jsonUsuarios = await resUsuarios.json();
          setUsuarios(
            Array.isArray(jsonUsuarios.usuarios)
              ? jsonUsuarios.usuarios
              : jsonUsuarios
          );
        }
      } catch (error) {
        console.error(error);
        toast.error("Error cargando reportes o usuarios");
      }
    };
    cargarReportes();
  }, []);

  if (!data)
    return (
      <div className="p-10 text-center text-gray-600 font-semibold">
        Cargando reportes...
      </div>
    );

  // ---------------- CALCULOS ----------------
  const ingresosTotales = Number(data.ingresos ?? 0).toFixed(2);
  const egresosTotales = Number(data.egresos ?? 0).toFixed(2);
  // Ahora ingresoBruto se muestra correctamente redondeado
  const ingresoBruto = Number(data.utilidad ?? 0).toFixed(2);

  const ventasMensuales = Array.isArray(data.ventasMensuales)
    ? data.ventasMensuales.map((v) => ({
        mes: v.mes?.substring(0, 3) ?? "??",
        ventas: Number(v.total ?? 0),
      }))
    : [];

  const comprasMensuales = Array.isArray(data.comprasMensuales)
    ? data.comprasMensuales.map((c) => ({
        mes: c.mes?.substring(0, 3) ?? "??",
        compras: Number(c.total ?? 0),
      }))
    : [];

  const graficoMensual = ventasMensuales.map((v) => {
    const compra = comprasMensuales.find((c) => c.mes === v.mes)?.compras ?? 0;
    return { mes: v.mes, ventas: v.ventas, compras: compra };
  });

  const productosMasVendidos = Array.isArray(data.productos)
    ? data.productos.map((p) => ({
        nombre: p.producto ?? "Desconocido",
        ventas: Number(p.total_vendido ?? 0),
      }))
    : [];

  const totalUsuarios = usuarios.length;
  const ultimosUsuarios = usuarios.slice(-7).reverse();

  // ------------------------- PDF PROFESIONAL --------------------------
  const exportarPDF = async () => {
    try {
      const pdf = new jsPDF();

      // ---------------- ENCABEZADO ----------------
      pdf.setFontSize(18);
      pdf.text("Reporte General - Sistema de Gestión", 10, 15);

      pdf.setFontSize(11);
      pdf.setTextColor(100);
      pdf.text("Generado automáticamente por el sistema", 10, 22);

      pdf.setLineWidth(0.5);
      pdf.line(10, 25, 200, 25);

      // ---------------- TABLA 1: Finanzas ----------------
      autoTable(pdf, {
        startY: 30,
        head: [["Resumen Financiero", "Monto (S/)"]],
        body: [
          ["Ingresos Totales", ingresosTotales],
          ["Egresos Totales", egresosTotales],
          ["Ingreso Bruto", ingresoBruto],
        ],
        theme: "grid",
        headStyles: { fillColor: [220, 38, 38], halign: "center" },
        bodyStyles: { halign: "center" },
      });

      // ---------------- TABLA 2: Productos ----------------
      autoTable(pdf, {
        startY: pdf.lastAutoTable.finalY + 10,
        head: [["Producto", "Ventas"]],
        body: productosMasVendidos.map((p) => [p.nombre, p.ventas]),
        theme: "striped",
        headStyles: { fillColor: [22, 163, 74] },
        bodyStyles: { halign: "center" },
      });

      // ---------------- TABLA 3: Usuarios ----------------
      autoTable(pdf, {
        startY: pdf.lastAutoTable.finalY + 10,
        head: [["Nombre", "Correo", "Rol"]],
        body: ultimosUsuarios.map((u) => [u.nombre, u.correo, u.rol]),
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
        bodyStyles: { halign: "left" },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 90 },
          2: { cellWidth: 30 },
        },
      });

      // ---------------- GUARDAR ----------------
      pdf.save("reporte-profesional.pdf");
      toast.success("Reporte generado correctamente");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Error generando el PDF");
    }
  };
  // ---------------------------------------------------------------------

  return (
    <div
      style={{
        backgroundColor: "#f9fafb",
        padding: "24px",
        minHeight: "100vh",
      }}
    >
      <div
        ref={reporteRef}
        style={{
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            color: "#dc2626",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaChartBar /> Reportes Generales
        </h1>

        {/* Tarjetas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "#16a34a",
              color: "#fff",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <p>Ingresos Totales</p>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>
              S/ {ingresosTotales}
            </h2>
          </div>

          <div
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <p>Egresos Totales</p>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>
              S/ {egresosTotales}
            </h2>
          </div>

          <div
            style={{
              backgroundColor: "#f59e0b",
              color: "#fff",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
            <p>Ingreso Bruto</p>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>
              S/ {ingresoBruto}
            </h2>
          </div>
        </div>

        {/* Gráficos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {/* Ventas vs Compras */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "16px",
              borderRadius: "16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              Ventas vs Compras (Mensual)
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graficoMensual}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventas" fill="#ef4444" name="Ventas (S/)" />
                <Bar dataKey="compras" fill="#facc15" name="Compras (S/)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Productos Más Vendidos */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "16px",
              borderRadius: "16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              Productos más vendidos
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productosMasVendidos}
                  dataKey="ventas"
                  nameKey="nombre"
                  outerRadius={120}
                  label
                >
                  {productosMasVendidos.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Usuarios + Rentabilidad */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {/* Usuarios */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "16px",
              borderRadius: "16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              Usuarios Registrados
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <div>
                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Total de usuarios
                </p>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  {totalUsuarios}
                </h3>
              </div>

              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Últimos registrados
                </p>
                <p
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                  }}
                >
                  {ultimosUsuarios.length}
                </p>
              </div>
            </div>

            <div
              style={{
                overflow: "auto",
                maxHeight: "192px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  textAlign: "left",
                  fontSize: "0.875rem",
                }}
              >
                <thead
                  style={{
                    backgroundColor: "#f3f4f6",
                    borderBottom: "1px solid #d1d5db",
                  }}
                >
                  <tr>
                    <th style={{ padding: "8px" }}>ID</th>
                    <th style={{ padding: "8px" }}>Nombre</th>
                    <th style={{ padding: "8px" }}>Correo</th>
                    <th style={{ padding: "8px" }}>Rol</th>
                  </tr>
                </thead>

                <tbody>
                  {ultimosUsuarios.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          padding: "16px",
                          textAlign: "center",
                          color: "#9ca3af",
                        }}
                      >
                        No hay usuarios.
                      </td>
                    </tr>
                  ) : (
                    ultimosUsuarios.map((u) => (
                      <tr
                        key={u.id}
                        style={{ borderBottom: "1px solid #e5e7eb" }}
                      >
                        <td style={{ padding: "8px" }}>{u.id}</td>
                        <td style={{ padding: "8px" }}>{u.nombre}</td>
                        <td style={{ padding: "8px" }}>{u.correo}</td>
                        <td style={{ padding: "8px" }}>{u.rol}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rentabilidad */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "16px",
              borderRadius: "16px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              Resumen de Rentabilidad
            </h2>

            <h3
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#16a34a",
              }}
            >
              S/ {ingresoBruto}
            </h3>

            <p style={{ color: "#6b7280", marginTop: "8px" }}>
              Ingreso bruto del periodo
            </p>

            <FaChartPie
              style={{
                color: "#dc2626",
                fontSize: "3rem",
                marginTop: "16px",
              }}
            />

            <button
              onClick={exportarPDF}
              style={{
                marginTop: "16px",
                backgroundColor: "#f59e0b",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaDownload /> Exportar Reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reportes;
