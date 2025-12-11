import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Box,
  Settings,
  LogOut,
  List,
} from "lucide-react";

const SidebarCliente = ({ onLogout }) => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: "/cliente/catalogo", label: "Catálogo", icon: <Box /> },
    { path: "/cliente/mis-pedidos", label: "Mis pedidos", icon: <List /> },
    { path: "/cliente/carrito", label: "Carrito", icon: <ShoppingCart /> },
    { path: "/cliente/perfil", label: "Perfil", icon: <User /> },

  ];

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } bg-gradient-to-b from-[#0F2C3E] to-[#081A24] text-[#E5E5E5] h-screen sticky top-0 p-4 transition-all duration-300 shadow-2xl flex flex-col`}
    >
      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1
              className={`font-bold text-lg tracking-wide transition-all duration-300 ${
                open ? "opacity-100" : "opacity-0 w-0"
              }`}
            >
              FIAMBRERÍA
              <br />
              PERÚ
            </h1>
            <button
              onClick={() => setOpen(!open)}
              className="hover:text-gray-300 transition-all"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Links */}
          <nav className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-[#D4AF37] text-black shadow-lg scale-105"
                    : "hover:bg-[#C69749]"
                }`}
              >
                {item.icon}
                {open && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-gray-600 pt-4">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 p-2 w-full text-left rounded-lg hover:bg-red-600 transition-all duration-300 hover:scale-105"
          >
            <LogOut />
            {open && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarCliente;
