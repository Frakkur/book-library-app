const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const pool           = require('./db');
const { autenticacion } = require('./middlewares/autenticacion');
const { registro, login } = require('./controllers/authController');
const catalogRoutes  = require('./routes/catalogRoutes');

const app  = express();
const PORT = process.env.PORT || 5001;

// ─── MIDDLEWARE GLOBAL (debe ir ANTES de cualquier ruta) ─────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ─── RUTAS ───────────────────────────────────────────────────────────────────
app.post('/api/auth/registro', registro);
app.post('/api/auth/login',    login);

app.get('/api/me', autenticacion, (req, res) => {
  res.json({ mensaje: 'Datos del usuario autenticado', usuario: req.usuario });
});

app.get('/api/usuarios', autenticacion, async (req, res) => {
  try {
    const resultado = await pool.query('SELECT id, nombre, email, rol FROM usuarios');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
});

// Catálogo — montaje único
app.use('/api/libros', catalogRoutes);

// ─── MANEJO GLOBAL DE ERRORES ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    detalles: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});