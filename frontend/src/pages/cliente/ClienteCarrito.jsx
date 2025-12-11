import React, { useState, useEffect } from "react";
import { useCarrito } from "./CarritoContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ClienteCarrito = () => {
  const { carrito, setCarrito, historial, setHistorial } = useCarrito();
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const idUsuario = user?.id_usuario || user?.id || user?.id_cliente || null;

  // =====================
  // Agrupar productos y sumar cantidad
  // =====================
  const [productosAgrupados, setProductosAgrupados] = useState([]);

  useEffect(() => {
    const agrupados = carrito.reduce((acc, item) => {
      const existe = acc.find((p) => p.id_producto === item.id_producto);
      if (existe) existe.cantidad += 1;
      else acc.push({ ...item, cantidad: 1 });
      return acc;
    }, []);
    setProductosAgrupados(agrupados);
  }, [carrito]);

  const total = productosAgrupados.reduce(
    (acc, p) => acc + p.precio_venta * p.cantidad,
    0
  );

  // =====================
  // Confirmar reserva
  // =====================
  const confirmarCompra = async () => {
    if (!idUsuario) return toast.error("Error: Usuario no encontrado");

    try {
      const res = await axios.post(
        "http://localhost:4000/api/publico/crear-venta",
        {
          id_usuario: idUsuario,
          metodo_pago: metodoPago,
          productos: productosAgrupados.map((p) => ({
            id_producto: p.id_producto,
            cantidad: p.cantidad,
            precio_venta: p.precio_venta,
          })),
        }
      );

      if (res.data.ok === true || res.data.ok === "true") {
        toast.success("Reserva de pedido registrada correctamente 🎉");
        setCarrito([]); // Vaciar carrito

        // Actualizar historial localmente
        const nuevoHistorial = [
          ...historial,
          {
            id_venta: res.data.venta.id_venta,
            fecha: res.data.venta.fecha,
            total,
            metodo_pago: metodoPago,
            productos: productosAgrupados.map((p) => ({
              id_producto: p.id_producto,
              cantidad: p.cantidad,
              precio_venta: p.precio_venta,
              nombre: p.nombre,
            })),
          },
        ];

        setHistorial(nuevoHistorial);
        localStorage.setItem("historial", JSON.stringify(nuevoHistorial));

        navigate("/cliente/mis-pedidos");
      } else if (res.data.msg) {
        toast.error(res.data.msg);
      }
    } catch (error) {
      console.error("Error en compra:", error);
      if (error?.response?.data?.msg) {
        toast.error(error.response.data.msg);
      }
    }
  };

  // =====================
  // Modificar cantidades
  // =====================
  const agregarUno = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const quitarUno = (producto) => {
    const index = carrito.findIndex((p) => p.id_producto === producto.id_producto);
    if (index !== -1) {
      const copia = [...carrito];
      copia.splice(index, 1);
      setCarrito(copia);
    }
  };

  const eliminarProducto = (id_producto) => {
    setCarrito(carrito.filter((p) => p.id_producto !== id_producto));
  };

  // =====================
  // Render
  // =====================
  return (
    <div className="flex flex-col bg-gray-100 min-h-screen p-6 items-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-extrabold text-red-600 text-center mb-6">
          🛒 Tu Carrito
        </h1>

        {productosAgrupados.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Tu carrito está vacío 😢
          </p>
        ) : (
          <>
            {productosAgrupados.map((producto) => (
              <div
                key={producto.id_producto}
                className="flex items-center justify-between p-4 border rounded-xl shadow-sm bg-white mb-4"
              >
                <div className="flex-1 px-4">
                  <h2 className="font-bold text-gray-800">{producto.nombre}</h2>
                  <p className="text-red-600 font-bold text-xl">
                    S/ {producto.precio_venta} x {producto.cantidad}
                  </p>
                  <p className="text-gray-700">
                    Subtotal:{" "}
                    <span className="font-bold">
                      S/ {(producto.precio_venta * producto.cantidad).toFixed(2)}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => agregarUno(producto)}
                    className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => quitarUno(producto)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 transition"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => eliminarProducto(producto.id_producto)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}

            <div className="text-right text-xl font-bold mt-6">
              Total: <span className="text-red-600">S/ {total.toFixed(2)}</span>
            </div>

            <select
              className="border p-2 rounded-xl mt-4 w-full"
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
            >
              <option>Efectivo</option>
              <option>Yape</option>
              <option>Plin</option>
            </select>

            <button
              onClick={confirmarCompra}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
            >
              Reservar pedido
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClienteCarrito;
