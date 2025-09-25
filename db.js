import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise();

  async function test() {
  try {
    await db.query("SELECT 1");
    console.log("Conexión a MySQL OK");
  } catch (err) {
    console.error("Error al conectar con la DB:", err.message);
  }
}
test();

export default db;
