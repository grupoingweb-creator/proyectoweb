import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // ==============================
  // Cargar ventas del admin
  // ==============================
  const cargarVentas = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/ventas/admin");
      if (res.data.ok) {
        // Ordenamos por Pendiente primero al cargar
        const ventasOrdenadas = ordenarPendientes(res.data.ventas);
        setVentas(ventasOrdenadas);
      } else {
        toast.error(res.data.msg || "Error al obtener ventas");
      }
    } catch (error) {
      console.error("Error al cargar ventas:", error);
      toast.error("Error del servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarVentas();
  }, []);

  // ==============================
  // Eliminar venta
  // ==============================
  const eliminar = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta venta?")) return;

    try {
      const res = await axios.delete(`http://localhost:4000/api/ventas/${id}`);
      if (res.data.ok) {
        toast.success(res.data.msg);
        setVentas((prev) => prev.filter((v) => v.id_venta !== id));
      } else {
        toast.error(res.data.msg || "Error al eliminar venta");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error del servidor");
    }
  };

  // ==============================
  // Función para ordenar pendientes
  // ==============================
  const ordenarPendientes = (lista) => {
    return lista.sort((a, b) => {
      if (a.estado === "Pendiente" && b.estado !== "Pendiente") return -1;
      if (a.estado !== "Pendiente" && b.estado === "Pendiente") return 1;
      return 0;
    });
  };

  // ==============================
  // Actualizar estado
  // ==============================
  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const res = await axios.put(`http://localhost:4000/api/ventas/${id}`, {
        estado: nuevoEstado,
      });
      if (res.data.ok) {
        toast.success("Estado actualizado correctamente");

        // Actualizar estado y reordenar
        setVentas((prev) => {
          const actualizado = prev.map((v) =>
            v.id_venta === id ? { ...v, estado: nuevoEstado } : v
          );
          return ordenarPendientes(actualizado);
        });
      } else {
        toast.error(res.data.msg || "No se pudo actualizar el estado");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error del servidor");
    }
  };

  // ==============================
  // Filtrar ventas por búsqueda
  // ==============================
  const ventasFiltradas = ventas.filter((v) =>
    v.nombre_usuario?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    const opciones = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(fecha).toLocaleDateString("es-PE", opciones);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ventas</h1>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por cliente..."
        className="mb-4 p-2 border rounded w-full max-w-sm"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {loading ? (
        <p className="text-gray-600">Cargando ventas...</p>
      ) : ventasFiltradas.length === 0 ? (
        <p className="text-gray-500 italic">No hay ventas registradas.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#0F2C3E] text-white">
              <tr>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Cliente</th>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Método</th>
                <th className="py-2 px-4">Estado</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {ventasFiltradas.map((v, index) => (
                <tr
                  key={v.id_venta}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="py-2 px-4">{v.id_venta}</td>
                  <td className="py-2 px-4">{v.nombre_usuario || "-"}</td>
                  <td className="py-2 px-4">{formatearFecha(v.fecha)}</td>
                  <td className="py-2 px-4">S/ {v.total ?? "-"}</td>
                  <td className="py-2 px-4">{v.metodo_pago || "-"}</td>

                  {/* Estado editable */}
                  <td className="py-2 px-4">
                    <select
                      className="border px-2 py-1 rounded"
                      value={v.estado || "Pendiente"}
                      onChange={(e) =>
                        actualizarEstado(v.id_venta, e.target.value)
                      }
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="Pagado">Pagado</option>
                      <option value="Anulado">Anulado</option>
                    </select>
                  </td>

                  {/* Acciones */}
                  <td className="py-2 px-4">
                    <button
                      onClick={() => eliminar(v.id_venta)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Ventas;
