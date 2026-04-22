const express = require('express');
const router = express.Router();

// INTENTA ESTO: Si falla con ../middlewares/, prueba con ../middleware/
const authModule = require('../middlewares/autenticacion'); 
const favoritesController = require('../controllers/favoritesController');

// Extraemos la función independientemente de cómo se exportó
const autenticacion = authModule.autenticacion || authModule;

router.use(autenticacion);

router.post('/', favoritesController.addFavorite);
router.delete('/:bookId', favoritesController.removeFavorite);
router.get('/', favoritesController.getUserFavorites);
router.get('/check/:bookId', favoritesController.isFavorite);

module.exports = router;