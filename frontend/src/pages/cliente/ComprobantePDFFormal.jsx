import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 10, fontSize: 10, fontFamily: "Helvetica" },
  header: { textAlign: "center", fontSize: 12, fontWeight: "bold", marginBottom: 5 },
  companyInfo: { textAlign: "center", marginBottom: 5 },
  section: { marginBottom: 5 },
  table: { marginTop: 5 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#000", paddingVertical: 2 },
  tableColHeader: { flex: 1, fontWeight: "bold" },
  tableCol: { flex: 1 },
  total: { textAlign: "right", fontSize: 12, fontWeight: "bold", marginTop: 5 },
  footer: { textAlign: "center", fontSize: 9, marginTop: 10 },
});

const ComprobantePDFFormal = ({ pedido, cliente }) => {
  const productos = pedido?.productos || [];
  const totalCalculado = productos.reduce((sum, p) => sum + p.precio_venta * p.cantidad, 0);

  return (
    <Document>
      <Page size={{ width: 200, height: "auto" }} style={styles.page}>
        <Text style={styles.header}>*** Fiambrería Delicias ***</Text>
        <View style={styles.companyInfo}>
          <Text>RUC: 20123456789</Text>
          <Text>Av. Los Embutidos 123, Lima</Text>
          <Text>Tel: 987654321</Text>
        </View>

        <View style={styles.section}>
          <Text>Cliente: {cliente?.nombre || "N/A"}</Text>
          <Text>Email: {cliente?.email || "N/A"}</Text>
          <Text>ID Pedido: {pedido?.id_venta || "N/A"}</Text>
          <Text>Fecha: {pedido?.fecha || "N/A"}</Text>
          <Text>Método: {pedido?.metodo_pago || "Efectivo"}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Producto</Text>
            <Text style={styles.tableColHeader}>Cant</Text>
            <Text style={styles.tableColHeader}>Precio</Text>
          </View>

          {productos.map((p, i) => (
            <View style={styles.tableRow} key={i}>
              <Text style={styles.tableCol}>{p.nombre || "N/A"}</Text>
              <Text style={styles.tableCol}>{p.cantidad}</Text>
              <Text style={styles.tableCol}>S/ {p.precio_venta.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.total}>TOTAL: S/ {totalCalculado.toFixed(2)}</Text>

        <Text style={styles.footer}>
          Gracias por su compra. ¡Vuelva pronto!
        </Text>
      </Page>
    </Document>
  );
};

export default ComprobantePDFFormal;
