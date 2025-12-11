import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCarrito } from "./CarritoContext";
import toast from "react-hot-toast";

const ClienteCatalogo = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const { carrito, agregarProducto, eliminarProducto } = useCarrito();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/publico/productos")
      .then((res) => setProductos(res.data.productos))
      .catch(() => toast.error("Error al cargar productos"));
  }, []);

  const productosFiltrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const cantidadProducto = (id) =>
    carrito.filter((p) => p.id_producto === id).length;

  const handleAgregar = (prod) => {
    agregarProducto({
      id_producto: prod.id_producto,
      nombre: prod.nombre,
      precio_venta: prod.precio_venta,
      imagen: prod.imagen,
    });
    toast.success(`${prod.nombre} agregado al carrito`);
  };

  const handleEliminar = (id) => {
    eliminarProducto(id);
    toast.success("Producto eliminado");
  };

  // 🔥 MAPA DE NOMBRES → ARCHIVOS REALES
  const imagenes = {
    chorizo: "/chorizo.jpg",
    jamonartesanal: "/jamon.jpg",
    lechebolsa: "/lecheBolsa.png",
    lechetarro: "/lecheTarro.jpg",
    quesofresco: "/quesofresco.jpg",
    oferta: "/o.jpg",
    fondo: "/fond1r.jpg",
    ryu: "/ryu.jpg",
    quesoandino: "/quesoandino.jpg",
    quesoedam: "/quesoedam.jpg",
    quesomantecoso: "/quesomantencoso.jpg",
    quesomozzarella: "/quesomozzarella.jpg",
    quesoparmesano: "/quesoparamesano.jpg",
    jamondepavo: "/jamonpavo.jpg",
    salameitaliano: "/salameitaliano.jpg",
    salchichafrankfurt:"/salchichafrankfurt.jpg",
    mortadelaartesanal: "/mortadela.jpg",
    huevosfrescos: "/huevo.jpg",
    chorizoparrillero: "/chorizoparrillero.jpg",
    jamoningles: "/jamoningles.jpg",
    tocinoahumado: "/tocinoahumado.jpg",
    pavoahumado: "/pavoahumado.jpg",
    yogurtnatural: "/yogurtnatural.jpg",
    LecheEnBolsa: "/lecheEnBolsa.jpeg",
  };

  const normalizar = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();

  const obtenerImagen = (nombre) => {
    const key = normalizar(nombre);
    return imagenes[key] || "/producto_default.jpg"; // fallback
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-7xl">
        <h1 className="text-4xl font-extrabold mb-4 text-red-600 text-center">
          🛒 Catálogo de Productos
        </h1>

        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Buscar producto..."
            className="border border-gray-300 rounded-xl px-5 py-3 w-full max-w-lg text-lg"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productosFiltrados.map((prod) => {
            const cantidad = cantidadProducto(prod.id_producto);

            return (
              <div
                key={prod.id_producto}
                className="border rounded-2xl bg-white p-4 shadow-md hover:shadow-xl transition hover:scale-[1.02]"
              >
                <img
                  src={obtenerImagen(prod.nombre)}
                  alt={prod.nombre}
                  className="w-full h-72 object-cover rounded-xl mb-4"
                />

                <h2 className="font-bold text-lg text-gray-800 h-14 text-center">
                  {prod.nombre}
                </h2>

                <p className="text-2xl text-center font-extrabold text-red-600">
                  S/ {prod.precio_venta}
                </p>

                {cantidad > 0 ? (
                  <div className="mt-4 flex justify-center items-center gap-2">
                    <button
                      onClick={() => handleEliminar(prod.id_producto)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-600 transition"
                    >
                      -
                    </button>
                    <span className="text-lg font-bold">{cantidad}</span>
                    <button
                      onClick={() => handleAgregar(prod)}
                      className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAgregar(prod)}
                    className="mt-4 w-full py-2 rounded-xl font-semibold transition bg-red-600 hover:bg-red-700 text-white"
                  >
                    Agregar al carrito
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClienteCatalogo;
