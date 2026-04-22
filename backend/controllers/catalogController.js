const pool = require('../db');
const { validar, schemaLibro } = require('../utils/validadores');

// GET /api/libros?titulo=&autor=
const obtenerLibros = async (req, res) => {
  try {
    const { titulo, autor } = req.query;
    let query  = 'SELECT * FROM libros WHERE 1=1';
    const params = [];

    if (titulo) {
      params.push(`%${titulo}%`);
      query += ` AND titulo ILIKE $${params.length}`;
    }
    if (autor) {
      params.push(`%${autor}%`);
      query += ` AND autor ILIKE $${params.length}`;
    }

    query += ' ORDER BY creado_en DESC';

    const resultado = await pool.query(query, params);
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// GET /api/libros/:id
const obtenerLibroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      'SELECT * FROM libros WHERE id = $1',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al obtener libro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// POST /api/libros  (solo admin)
const crearLibro = async (req, res) => {
  try {
    const validacion = validar(schemaLibro, req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: validacion.errores,
      });
    }

    const { titulo, autor, total_paginas, descripcion, genero, anio_publicacion, imagen_url } = validacion.datos;

    const resultado = await pool.query(
      `INSERT INTO libros (titulo, autor, total_paginas, descripcion, genero, anio_publicacion, imagen_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [titulo, autor, total_paginas, descripcion, genero, anio_publicacion, imagen_url]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al crear libro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// PUT /api/libros/:id  (solo admin)
const actualizarLibro = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que existe
    const existente = await pool.query('SELECT id FROM libros WHERE id = $1', [id]);
    if (existente.rows.length === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    const validacion = validar(schemaLibro, req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: validacion.errores,
      });
    }

    const { titulo, autor, total_paginas, descripcion, genero, anio_publicacion, imagen_url } = validacion.datos;

    const resultado = await pool.query(
      `UPDATE libros
       SET titulo=$1, autor=$2, total_paginas=$3, descripcion=$4,
           genero=$5, anio_publicacion=$6, imagen_url=$7
       WHERE id=$8
       RETURNING *`,
      [titulo, autor, total_paginas, descripcion, genero, anio_publicacion, imagen_url, id]
    );

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// DELETE /api/libros/:id  (solo admin)
const eliminarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pool.query(
      'DELETE FROM libros WHERE id = $1 RETURNING id',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json({ mensaje: 'Libro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  obtenerLibros,
  obtenerLibroPorId,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
};