const db = require('../db');

const favoritesController = {
  // 1. Obtener favoritos con JOIN (Corregido y sin duplicados)
  getUserFavorites: async (req, res) => {
    try {
      const usuario = req.usuario || req.user;
      
      if (!usuario || !usuario.id) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      // Eliminamos el CAST. Comparamos l.id directamente con f.libro_id
      const query = `
        SELECT f.id, f.libro_id, l.titulo, l.imagen_url, f.creado_en 
        FROM favoritos f
        INNER JOIN libros l ON f.libro_id = l.id
        WHERE f.usuario_id = $1
        ORDER BY f.creado_en DESC
      `;
      
      const result = await db.query(query, [usuario.id]);
      res.json(result.rows);
    } catch (err) {
      // Imprimimos el error real en la terminal para saber qué pasa si falla
      console.error('Error detallado en getUserFavorites:', err);
      res.status(500).json({ error: 'Error al obtener favoritos' });
    }
  },

  // 2. Agregar a favoritos
  addFavorite: async (req, res) => {
    try {
      const { libro_id } = req.body;
      const usuario = req.usuario || req.user;
      const query = 'INSERT INTO favoritos (usuario_id, libro_id) VALUES ($1, $2) RETURNING id';
      const result = await db.query(query, [usuario.id, libro_id]);
      
      res.status(201).json({ message: 'Agregado', id: result.rows[0].id });
    } catch (err) {
      if (err.code === '23505') return res.status(409).json({ error: 'Ya es favorito' });
      
      console.error('Error en addFavorite:', err);
      res.status(500).json({ error: 'Error interno' });
    }
  },

  // 3. Remover de favoritos
  removeFavorite: async (req, res) => {
    try {
      const { bookId } = req.params;
      const usuario = req.usuario || req.user;
      
      // Aseguramos que se envíe el parámetro correcto
      const query = 'DELETE FROM favoritos WHERE usuario_id = $1 AND libro_id = $2';
      await db.query(query, [usuario.id, bookId]); // Quitamos el String() por si tu DB usa INT
      
      res.json({ message: 'Removido' });
    } catch (err) {
      console.error('Error en removeFavorite:', err);
      res.status(500).json({ error: 'Error al eliminar' });
    }
  },

  // 4. Verificar si es favorito
  isFavorite: async (req, res) => {
    try {
      const { bookId } = req.params;
      const usuario = req.usuario || req.user;
      
      const query = 'SELECT id FROM favoritos WHERE usuario_id = $1 AND libro_id = $2';
      const result = await db.query(query, [usuario.id, bookId]);
      
      res.json({ isFavorite: result.rows.length > 0 });
    } catch (err) {
      console.error('Error en isFavorite:', err);
      res.status(500).json({ error: 'Error' });
    }
  }
};

module.exports = favoritesController;