import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port:process.env.DB_PORT,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
}).promise();

async function test() {
  try {
    console.log("Conexion exitosa a la base de datos");
  }
  catch (err) {
    console.error("Error conectando a la db" , err.message);
  }
}

test();
export default db;