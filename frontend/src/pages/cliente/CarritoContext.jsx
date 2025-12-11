import { createContext, useContext, useState } from "react";

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  // Estado del carrito
  const [carrito, setCarrito] = useState([]);

  // Estado del usuario
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  // =====================
  // Funciones del carrito
  // =====================
  const agregarProducto = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const eliminarProducto = (id_producto) => {
    const index = carrito.findIndex((p) => p.id_producto === id_producto);
    if (index !== -1) {
      const copia = [...carrito];
      copia.splice(index, 1);
      setCarrito(copia);
    }
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // =====================
  // Funciones del usuario
  // =====================
  const login = (usuario) => {
    setUser(usuario);
    localStorage.setItem("user", JSON.stringify(usuario));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    vaciarCarrito(); // limpiar carrito al cerrar sesión
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        setCarrito,
        agregarProducto,
        eliminarProducto,
        vaciarCarrito,
        user,
        setUser,
        login,
        logout,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
