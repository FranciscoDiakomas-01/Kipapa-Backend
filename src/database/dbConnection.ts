import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

export default async function ConnectionDB() {
    const pool: Pool = new Pool({
      host: process.env.DB_HOST,
      password: process.env.DB_PASS,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT),
    });
    await pool.connect()
    return pool
}