import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Utensils } from "lucide-react";
import toast from "react-hot-toast";

const Login = ({ setLoggedIn, setUser }) => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !contrasena) {
      toast.error("Completa ambos campos");
      return;
    }

    // Admin predefinido
    if (correo === "adminfiambreria@gmail.com" && contrasena === "1234") {
      const adminData = {
        id: 0, // 👈 consistente con ClientePerfil
        nombre: "Administrador",
        rol: "Administrador",
        correo,
      };
      setUser(adminData);
      localStorage.setItem("user", JSON.stringify(adminData));
      setLoggedIn(true);
      navigate("/dashboard");
      toast.success("Bienvenido Administrador");
      return;
    }

    // Cliente: validar en backend
    try {
      const res = await axios.post("http://localhost:4000/api/usuario/login", {
        correo,
        contrasena,
      });

      if (res.data.ok) {
        const userData = {
          id: res.data.user.id, // 👈 id consistente con ClientePerfil
          nombre: res.data.user.nombre,
          rol: res.data.user.rol || "Cliente",
          correo: res.data.user.correo,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        setLoggedIn(true);

        navigate("/cliente/catalogo");
        toast.success(`Bienvenido ${res.data.user.nombre}`);
      } else {
        toast.error(res.data.msg);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Error de conexión");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/fond1r.jpg')" }}
    >
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border-t-4 border-red-500">
        <div className="flex flex-col items-center mb-8">
          <Utensils className="w-12 h-12 text-red-500 mb-2" />
          <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-red-400 shadow-md">
            <img src="/ryu.jpg" alt="Logo" className="object-cover w-full h-full" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mt-4 text-center">
            FIAMBRERÍA PERÚ S.A.C.
          </h1>
          <p className="text-gray-600 text-sm italic mt-2">
            “Calidad y sabor en cada bocado”
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="********"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:bg-red-700 hover:shadow-lg"
          >
            Ingresar
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            ¿No tienes cuenta?{" "}
            <Link to="/crear-cuenta" className="text-red-500 hover:underline">
              Crear Cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
