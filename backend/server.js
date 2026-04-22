const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./db');
const { autenticacion } = require('./middlewares/autenticacion');
const { registro, login } = require('./controllers/authController');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Rutas de autenticación
app.post('/api/auth/registro', registro);
app.post('/api/auth/login', login);

// Ruta protegida de ejemplo: obtener datos del usuario actual
app.get('/api/me', autenticacion, (req, res) => {
  res.json({
    mensaje: 'Datos del usuario autenticado',
    usuario: req.usuario,
  });
});

// Ruta protegida: obtener todos los usuarios (solo para desarrollo)
app.get('/api/usuarios', autenticacion, async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT id, nombre, email, rol FROM usuarios'
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    detalles: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor seguro corriendo en http://localhost:${PORT}`);
  console.log(`Autenticación con JWT y bcrypt habilitada`);
});