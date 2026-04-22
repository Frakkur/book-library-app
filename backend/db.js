const { Pool } = require('pg');
require('dotenv').config();

/**
 * Pool de conexión a PostgreSQL
 * Las credenciales vienen de variables de entorno (.env)
 * NUNCA hardcodear credenciales en el código
 */
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Manejar errores de conexión
pool.on('error', (err) => {
  console.error('Error en pool de PostgreSQL:', err);
  process.exit(-1);
});

module.exports = pool;