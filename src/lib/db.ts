import mysql from "mysql2/promise";

let connection: mysql.Connection | null = null;

export async function connectToDatabase(): Promise<mysql.Connection> {
  if (connection) return connection;

  connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "test",
  });

  console.log("Connected to MySQL");
  return connection;
}
