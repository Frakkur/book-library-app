const express = require('express');
const cors    = require('cors');
const path    = require('path'); // Necesario para las imágenes
require('dotenv').config();




const pool            = require('./db');
const { autenticacion } = require('./middlewares/autenticacion');
const { registro, login } = require('./controllers/authController');
const catalogRoutes   = require('./routes/catalogRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');

const app  = express();
const PORT = process.env.PORT || 5001;

// ─── MIDDLEWARE GLOBAL ──────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ─── SERVIR IMÁGENES (Soluciona el error 404 de las fotos) ──────────────────
// Esto hace que si accedes a http://localhost:5001/public/lo-que-sea.jpg funcione
app.use('/public', express.static(path.join(__dirname, 'public')));

// ─── RUTAS PÚBLICAS ─────────────────────────────────────────────────────────
app.post('/api/auth/registro', registro);
app.post('/api/auth/login',    login);

// ─── RUTAS PROTEGIDAS (Requieren Token) ─────────────────────────────────────
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

// Montaje de rutas con prefijo api
app.use('/api/libros', catalogRoutes);
// Protegemos favoritos globalmente aquí
app.use('/api/favorites', autenticacion, favoritesRoutes);
app.use('/public', express.static(path.join(__dirname, 'public')));

// ─── MANEJO GLOBAL DE ERRORES ────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error Detectado:', err.message);
  res.status(500).json({
    error: 'Error interno del servidor',
    detalles: err.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});