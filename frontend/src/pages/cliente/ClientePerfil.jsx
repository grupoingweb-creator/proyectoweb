import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ClientePerfil = ({ user: userProp, setUser, setLoggedIn }) => {
  const navigate = useNavigate();

  const [user, setLocalUser] = useState(null);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // ================================
  //   CARGAR USUARIO SOLO UNA VEZ
  // ================================
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const stored = userProp || JSON.parse(localStorage.getItem("user"));

        if (!stored || stored.id === undefined) {
          toast.error("No se encontró usuario");
          return;
        }

        // ADMIN NO CONSULTA BACKEND
        if (stored.id === 0) {
          setLocalUser(stored);
          setNombre(stored.nombre);
          setCorreo(stored.correo);
          return;
        }

        // CLIENTE → Consultar backend
        const res = await axios.get(`http://localhost:4000/api/usuario/${stored.id}`);

        if (res.data.ok) {
          const u = res.data.user;
          setLocalUser(u);
          setNombre(u.nombre);
          setCorreo(u.correo);
          localStorage.setItem("user", JSON.stringify(u));
        } else {
          toast.error("Usuario no encontrado");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar usuario");
      }
    };

    cargarUsuario();
  }, []); // SOLO UNA VEZ

  if (!user) return <p className="text-center mt-10">Cargando usuario...</p>;

  // ================================
  //   ACTUALIZAR PERFIL
  // ================================
  const handleActualizar = async () => {
    if (!nombre || !correo) return toast.error("Completa ambos campos");
    setLoading(true);

    try {
      const res = await axios.put(
        `http://localhost:4000/api/usuario/${user.id}`,
        { nombre, correo }
      );

      if (res.data.ok) {
        const updated = res.data.user;
        setLocalUser(updated);
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));

        toast.success("Perfil actualizado");
        setEditMode(false);
      } else {
        toast.error(res.data.msg);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  //   ELIMINAR CUENTA
  // ================================
  const handleEliminar = async () => {
    if (!window.confirm("¿Desea eliminar su cuenta?")) return;

    try {
      const res = await axios.delete(`http://localhost:4000/api/usuario/${user.id}`);

      if (res.data.ok) {
        localStorage.removeItem("user");
        setUser(null);
        setLoggedIn(false);

        navigate("/login", { replace: true });
        toast.success("Cuenta eliminada");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-red-600 text-center mb-6">
          👤 Mi Perfil
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-600">Nombre:</label>
            {editMode ? (
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              <p>{nombre}</p>
            )}
          </div>

          <div>
            <label className="text-gray-600">Correo:</label>
            {editMode ? (
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              <p>{correo}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-gray-600">Rol:</label>
            <p>{user.rol}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          {editMode ? (
            <>
              <button
                onClick={handleActualizar}
                disabled={loading}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setNombre(user.nombre);
                  setCorreo(user.correo);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Editar
              </button>
              <button
                onClick={handleEliminar}
                className="bg-red-700 text-white px-4 py-2 rounded"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientePerfil;
