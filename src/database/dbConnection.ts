import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()
const pool: Pool = new Pool({
      connectionString : String(process.env.DB_URL)
});
export default pool