import React, { useState, useEffect } from "react";
import { User, Edit, Trash2, Plus, Search, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const [editando, setEditando] = useState(null);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    rol: "Cliente",
  });

  // CARGAR USUARIOS
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/usuario");
      if (res.data.ok) {
        setUsuarios(res.data.usuarios);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar usuarios");
    }
  };

  // GUARDAR
  const handleGuardar = async () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.correo) {
      return toast.error("Completa todos los campos");
    }

    try {
      if (editando) {
        await axios.put(
          `http://localhost:4000/api/usuario/${editando}`,
          nuevoUsuario
        );
        toast.success("Usuario actualizado");
      } else {
        await axios.post("http://localhost:4000/api/usuario", {
          ...nuevoUsuario,
          contrasena: "123456", // contraseña default
        });
        toast.success("Usuario creado");
      }

      setMostrarModal(false);
      setNuevoUsuario({ nombre: "", correo: "", rol: "Cliente" });
      setEditando(null);
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar");
    }
  };

  // EDITAR
  const handleEditar = (u) => {
    setNuevoUsuario({
      nombre: u.nombre,
      correo: u.correo,
      rol: u.rol,
    });
    setEditando(u.id);
    setMostrarModal(true);
  };

  // ELIMINAR
  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/usuario/${id}`);
      toast.success("Usuario eliminado");
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar");
    }
  };

  // FILTRO
  const filtrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 relative">
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center w-full md:w-1/2 border border-gray-300 rounded-lg px-3 py-2">
          <Search className="text-gray-500 mr-2" size={20} />
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        <button
          onClick={() => {
            setNuevoUsuario({ nombre: "", correo: "", rol: "Cliente" });
            setEditando(null);
            setMostrarModal(true);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded-lg shadow-md flex items-center gap-2 transition"
        >
          <Plus size={18} />
          Nuevo Usuario
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0F2C3E] text-white">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Correo</th>
              <th className="py-3 px-4">Rol</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((u, index) => (
              <tr
                key={u.id}
                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
              >
                <td className="py-3 px-4">{u.id}</td>
                <td className="py-3 px-4 font-semibold">{u.nombre}</td>
                <td className="py-3 px-4">{u.correo}</td>
                <td className="py-3 px-4">{u.rol}</td>

                <td className="py-3 px-4 flex justify-center gap-3">
                  <button
                    onClick={() => handleEditar(u)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleEliminar(u.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {filtrados.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4 italic">
                  No se encontraron usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setMostrarModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-2">
              <User /> {editando ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>

            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Nombre"
                value={nuevoUsuario.nombre}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
                }
                className="border p-2 rounded-lg"
              />

              <input
                type="email"
                placeholder="Correo"
                value={nuevoUsuario.correo}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })
                }
                className="border p-2 rounded-lg"
              />

              <select
                value={nuevoUsuario.rol}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value })
                }
                className="border p-2 rounded-lg"
              >
                <option value="Cliente">Cliente</option>
                <option value="Admin">Administrador</option>
              </select>

              <button
                onClick={handleGuardar}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
              >
                {editando ? "Actualizar Usuario" : "Guardar Usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;
