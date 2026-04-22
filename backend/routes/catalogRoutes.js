const express = require('express');
const router  = express.Router();
const { autenticacion, autorizar } = require('../middlewares/autenticacion');
const {
  obtenerLibros,
  obtenerLibroPorId,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
} = require('../controllers/catalogController');

// Rutas públicas para usuarios autenticados (cualquier rol)
router.get('/',    autenticacion, obtenerLibros);
router.get('/:id', autenticacion, obtenerLibroPorId);

// Rutas protegidas solo para admin
router.post('/',    autenticacion, autorizar('admin'), crearLibro);
router.put('/:id',  autenticacion, autorizar('admin'), actualizarLibro);
router.delete('/:id', autenticacion, autorizar('admin'), eliminarLibro);

module.exports = router;