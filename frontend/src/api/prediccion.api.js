const API_URL = import.meta.env.VITE_API_URL;


export async function getPrediccion() {
  const res = await fetch(`${API_URL}/prediccion`);
  if (!res.ok) throw new Error("Error al obtener la predicción");
  return await res.json();
}

export async function getVentasMensuales() {
  const res = await fetch(`${API_URL}/prediccion`);
  if (!res.ok) throw new Error("Error al obtener ventas mensuales");
  const data = await res.json();

  const mesesNombre = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return (data.historial || []).map(v => ({
    mes: mesesNombre[(Number(v.mes) - 1) % 12] || "Mes",
    total: Number(v.total_ventas),
  }));
}
