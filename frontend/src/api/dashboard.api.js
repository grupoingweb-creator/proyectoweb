import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export const getDashboardData = async () => {
  try {
    const res = await axios.get(API_URL); // ❗ SIN BARRA FINAL
    return res.data;
  } catch (error) {
    console.error("❌ Error en getDashboardData:", error);
    throw error;
  }
};
