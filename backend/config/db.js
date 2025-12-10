import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "pepe777",
  password: process.env.DB_PASSWORD || "D@nteNocturno",
  database: process.env.DB_NAME || "special",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verificar conexión
db.getConnection()
  .then((conn) => {
    console.log("✅ Conexión exitosa a la base de datos MySQL");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Error al conectar con la base de datos:", err);
  });

export default db;
