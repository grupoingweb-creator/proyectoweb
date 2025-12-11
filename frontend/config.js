export const API_URL = "https://proyectoweb-knts.onrender.com/api";

import { API_URL } from "../config";

axios.get(`${API_URL}/usuario/usuarios`);
axios.post(`${API_URL}/usuario/login`);
axios.put(`${API_URL}/usuario/${id}`);
axios.delete(`${API_URL}/usuario/${id}`);
