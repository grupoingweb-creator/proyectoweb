// src/pages/ClientePedido.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";

const ClientePedido = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const idUsuario = user?.id_usuario || user?.id || user?.id_cliente || null;

  const fetchHistorial = async () => {
    if (!idUsuario) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/api/publico/historial/${idUsuario}`);
      if (res.data.ok) {
        setHistorial(res.data.historial);
        localStorage.setItem("historial", JSON.stringify(res.data.historial));
      }
    } catch (error) {
      console.error("Error al obtener historial:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!idUsuario) return navigate("/");
    fetchHistorial();
  }, [idUsuario]);

  // ==========================
  // PDF Estilo Ticket Pre-venta
  // ==========================
  const descargarPDF = (venta) => {
  const doc = new jsPDF({ unit: "mm", format: [80, 200] });
  let y = 10;

  // --- Encabezado ---
  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138);
  doc.setFont("helvetica", "bold");
  doc.text("FIAMBRERÍA PERÚ S.A.C.", 40, y, { align: "center" });
  y += 5;

  doc.setFontSize(8);
  doc.setTextColor(75, 85, 99);
  doc.setFont("helvetica", "normal");
  doc.text("RUC: 20567890123", 40, y, { align: "center" });
  y += 4;
  doc.text("Av. Grau 456 - Tacna", 40, y, { align: "center" });
  y += 4;
  doc.text("Tel: 952341678", 40, y, { align: "center" });
  y += 6;

  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.5);
  doc.line(5, y, 75, y);
  y += 4;

  // --- Datos del pedido ---
  doc.setTextColor(55, 65, 81);
  doc.setFontSize(8);
  doc.text(`Pedido #: ${venta.id_venta}`, 5, y);
  y += 4;
  doc.text(`Fecha: ${new Date(venta.fecha).toLocaleDateString()}`, 5, y);
  y += 4;
  doc.text(`Método de pago: ${venta.metodo_pago}`, 5, y);
  y += 5;

  doc.line(5, y, 75, y);
  y += 4;

  // --- Tabla productos ---
  const colProducto = 5;
  const colCantidad = 50;
  const colSubtotal = 65;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(185, 28, 28);
  doc.text("Producto", colProducto, y);
  doc.text("Cant", colCantidad, y, { align: "right" });
  doc.text("Subt", colSubtotal, y, { align: "right" });
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(55, 65, 81);

  (venta.productos || []).forEach((p) => {
    const subtotal = (p.precio_venta * p.cantidad).toFixed(2);

    // Ajustar nombre si es muy largo
    const nombre = p.nombre.length > 20 ? p.nombre.substring(0, 17) + "..." : p.nombre;

    doc.text(nombre, colProducto, y);
    doc.text(String(p.cantidad), colCantidad, y, { align: "right" });
    doc.text(`S/ ${subtotal}`, colSubtotal, y, { align: "right" });

    y += 4;
  });

  y += 2;
  doc.line(5, y, 75, y);
  y += 4;

  // --- Total ---
  doc.setFont("helvetica", "bold");
  doc.setTextColor(185, 28, 28);
  doc.text(`TOTAL: S/ ${Number(venta.total || 0).toFixed(2)}`, colSubtotal, y, { align: "right" });
  y += 6;

  // --- Footer ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(107, 114, 128);
  doc.text("Boleta de Pre-venta", 40, y, { align: "center" });
  y += 3;
  doc.text("Conserve este comprobante para cualquier consulta", 40, y, { align: "center" });

  doc.save(`pedido_${venta.id_venta}.pdf`);
};


  // ==========================
  // Funciones eliminar pedidos
  // ==========================
  const eliminarPedido = async (id_venta) => {
    if (!window.confirm("¿Seguro quieres eliminar este pedido?")) return;
    try {
      const res = await axios.delete(`http://localhost:4000/api/publico/venta/${id_venta}`);
      if (res.data.ok) {
        const nuevoHistorial = historial.filter((v) => v.id_venta !== id_venta);
        setHistorial(nuevoHistorial);
        localStorage.setItem("historial", JSON.stringify(nuevoHistorial));
        alert("Pedido eliminado correctamente");
      } else alert(res.data.msg || "No se pudo eliminar el pedido");
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      alert("Error al eliminar pedido");
    }
  };

  const eliminarTodos = async () => {
    if (!window.confirm("¿Seguro quieres eliminar todos tus pedidos?")) return;
    try {
      const res = await axios.delete(`http://localhost:4000/api/publico/ventas/${idUsuario}`);
      if (res.data.ok) {
        setHistorial([]);
        localStorage.removeItem("historial");
        alert("Todos los pedidos eliminados correctamente");
      } else alert(res.data.msg || "No se pudieron eliminar todos los pedidos");
    } catch (error) {
      console.error("Error al eliminar todos los pedidos:", error);
      alert("Error al eliminar todos los pedidos");
    }
  };

  // ==========================
  // Render
  // ==========================
  if (loading)
    return <div className="text-center mt-20 text-lg text-gray-600">Cargando pedidos...</div>;
  if (!idUsuario) return <p className="text-center mt-20">Debes iniciar sesión primero</p>;

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen p-6 items-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-extrabold text-blue-900 text-center mb-6">Mis Pedidos</h1>

        {historial.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={eliminarTodos}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold"
            >
              Eliminar todos
            </button>
          </div>
        )}

        {historial.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 text-lg">Aún no tienes pedidos registrados</p>
            <button
              onClick={() => navigate("/cliente/carrito")}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
            >
              Volver al carrito
            </button>
          </div>
        ) : (
          historial
            .slice()
            .reverse()
            .map((venta) => (
              <div key={venta.id_venta} className="border rounded-xl p-4 mb-6 shadow-md bg-white">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Pedido #{venta.id_venta}
                </h2>
                <p className="text-gray-600 mb-2">
                  Fecha: <span className="font-semibold">{new Date(venta.fecha).toLocaleDateString()}</span>
                </p>
                <p className="text-gray-600 mb-4">
                  Método de pago: <span className="font-semibold">{venta.metodo_pago}</span>
                </p>

                <h3 className="text-lg font-bold text-gray-700 mb-3">Productos:</h3>
                {(venta.productos || []).map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-xl mb-3 bg-gray-50">
                    <div className="flex-1 px-4">
                      <p className="font-bold text-gray-800">{p.nombre}</p>
                      <p className="text-gray-700">
                        Cantidad: <span className="font-semibold">{p.cantidad || 0}</span>
                      </p>
                      <p className="text-red-600 font-bold">
                        S/ {Number(p.precio_venta || 0).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-black">
                      S/ {(Number(p.precio_venta || 0) * (p.cantidad || 0)).toFixed(2)}
                    </p>
                  </div>
                ))}

                <div className="text-right font-bold text-xl text-red-600 mt-2">
                  Total: S/ {Number(venta.total || 0).toFixed(2)}
                </div>

                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => descargarPDF(venta)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
                  >
                    Descargar PDF
                  </button>
                  <button
                    onClick={() => eliminarPedido(venta.id_venta)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ClientePedido;
