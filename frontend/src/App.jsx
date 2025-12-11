import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import Ventas from "./pages/admin/Ventas";
import Facturacion from "./pages/admin/Facturacion";
import Productos from "./pages/admin/Productos";
import Clientes from "./pages/admin/Clientes";
import Proveedores from "./pages/admin/Proveedores";
import Compras from "./pages/admin/Compras";
import Reportes from "./pages/admin/Reportes";
import Configuracion from "./pages/admin/Configuracion";
import CrearCuenta from "./pages/admin/CrearCuenta";
import Login from "./pages/admin/Login";

// 🔥 NUEVO: Página Usuarios Admin
import Usuarios from "./pages/admin/Usuarios";

// Cliente pages
import ClienteCatalogo from "./pages/cliente/ClienteCatalogo";
import ClienteCarrito from "./pages/cliente/ClienteCarrito";
import ClientePedido from "./pages/cliente/ClientePedido";
import ClientePerfil from "./pages/cliente/ClientePerfil";

// Sidebar
import Sidebar from "./components/Sidebar";
import SidebarCliente from "./components/SidebarCliente";

// Context
import { CarritoProvider } from "./pages/cliente/CarritoContext";

// Layouts
const AdminLayout = ({ children, onLogout }) => (
  <div className="flex">
    <Sidebar onLogout={onLogout} />
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">{children}</div>
  </div>
);

const ClienteLayout = ({ children, onLogout }) => (
  <div className="flex">
    <SidebarCliente onLogout={onLogout} />
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">{children}</div>
  </div>
);

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loggedIn, setLoggedIn] = useState(!!user);

  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("historial");
  };

  return (
    <CarritoProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={
            !loggedIn ? (
              <Login setLoggedIn={setLoggedIn} setUser={setUser} />
            ) : user?.rol === "Administrador" ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/cliente/catalogo" />
            )
          }
        />

        <Route path="/crear-cuenta" element={<CrearCuenta />} />

        {/* ADMIN */}
        <Route
          path="/dashboard"
          element={
            loggedIn && user?.rol === "Administrador" ? (
              <AdminLayout onLogout={handleLogout}>
                <Dashboard />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/ventas"
          element={
            loggedIn && user?.rol === "Administrador" ? (
              <AdminLayout onLogout={handleLogout}>
                <Ventas />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />


        <Route
          path="/productos"
          element={
            loggedIn && user?.rol === "Administrador" ? (
              <AdminLayout onLogout={handleLogout}>
                <Productos />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/clientes"
          element={
            loggedIn && user?.rol === "Administrador" ? (
              <AdminLayout onLogout={handleLogout}>
                <Clientes />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/proveedores"
          element={
            loggedIn && user?.rol === "Administrador" ? (
              <AdminLayout onLogout={handleLogout}>
                <Proveedores />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/compras"
          element={
            loggedIn && user?.rol === "Administrador" ? (
              <AdminLayout onLogout={handleLogout}>
                <Compras />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/facturacion"
          element={
            loggedIn && user?.rol === "Administrador" ? (
              <AdminLayout onLogout={handleLogout}>
                <Facturacion />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/reportes"
          element={
            loggedIn && user?.rol === "Administrador" ? (
              <AdminLayout onLogout={handleLogout}>
                <Reportes />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/configuracion"
          element={
            loggedIn && user?.rol === "Administrador" ? (
              <AdminLayout onLogout={handleLogout}>
                <Configuracion />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* ⭐ NUEVO: Módulo Usuarios */}
        <Route
          path="/usuarios"
          element={
            loggedIn && user?.rol === "Administrador" ? (
              <AdminLayout onLogout={handleLogout}>
                <Usuarios />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* CLIENTE */}
        <Route
          path="/cliente/catalogo"
          element={
            loggedIn && user?.rol === "Cliente" ? (
              <ClienteLayout onLogout={handleLogout}>
                <ClienteCatalogo user={user} setUser={setUser} />
              </ClienteLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/cliente/carrito"
          element={
            loggedIn && user?.rol === "Cliente" ? (
              <ClienteLayout onLogout={handleLogout}>
                <ClienteCarrito user={user} setUser={setUser} />
              </ClienteLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/cliente/mis-pedidos"
          element={
            loggedIn && user?.rol === "Cliente" ? (
              <ClienteLayout onLogout={handleLogout}>
                <ClientePedido user={user} setUser={setUser} />
              </ClienteLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/cliente/perfil"
          element={
            loggedIn && user?.rol === "Cliente" ? (
              <ClienteLayout onLogout={handleLogout}>
                <ClientePerfil
                  user={user}
                  setUser={setUser}
                  setLoggedIn={setLoggedIn}
                />
              </ClienteLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </CarritoProvider>
  );
}

export default App;
