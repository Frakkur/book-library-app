const bcrypt = require('bcryptjs');
const pool = require('../db');
const { generarToken } = require('../utils/jwt');
const { validar, schemaRegistro, schemaLogin } = require('../utils/validadores');

const registro = async (req, res) => {
  try {
    // 1. Validar datos de entrada con Zod
    const validacion = validar(schemaRegistro, req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: validacion.errores,
      });
    }

    const { nombre, email, contrasena } = validacion.datos;

    // 2. Verificar que el email no esté registrado
    const usuarioExistente = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1',
      [email]
    );
    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        error: 'Este email ya está registrado',
      });
    }

    // 3. Hashear contraseña con bcrypt (10 rondas = seguridad suficiente)
    const salt = await bcrypt.genSalt(10);
    const contrasenaHasheada = await bcrypt.hash(contrasena, salt);

    // 4. Guardar usuario en BD (SIN la contraseña en texto plano)
    const resultado = await pool.query(
      'INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol',
      [nombre, email, contrasenaHasheada, 'usuario'] // rol por defecto: usuario
    );

    const usuarioNuevo = resultado.rows[0];

    // 5. Generar JWT (sin contraseña, solo id + email + rol)
    const token = generarToken({
      id: usuarioNuevo.id,
      email: usuarioNuevo.email,
      rol: usuarioNuevo.rol,
    });

    // 6. Responder con token (NO enviar contraseña)
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuarioNuevo.id,
        nombre: usuarioNuevo.nombre,
        email: usuarioNuevo.email,
        rol: usuarioNuevo.rol,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Error en el servidor',
    });
  }
};

/**
 * POST /api/auth/login
 * Inicia sesión comparando contraseña hasheada
 */
const login = async (req, res) => {
  try {
    // 1. Validar datos de entrada
    const validacion = validar(schemaLogin, req.body);
    if (!validacion.valido) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: validacion.errores,
      });
    }

    const { email, contrasena } = validacion.datos;

    // 2. Buscar usuario por email (SIN verificar contraseña aún)
    const resultado = await pool.query(
      'SELECT id, nombre, email, contrasena, rol FROM usuarios WHERE email = $1',
      [email]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({
        error: 'Email o contraseña incorrectos',
      });
    }

    const usuario = resultado.rows[0];

    // 3. Comparar contraseña ingresada con hash en BD
    // bcrypt.compare devuelve true/false sin revelar el hash
    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena
    );

    if (!contrasenaValida) {
      return res.status(401).json({
        error: 'Email o contraseña incorrectos',
      });
    }

    // 4. Generar JWT
    const token = generarToken({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    });

    // 5. Responder con token
    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error en el servidor',
    });
  }
};

module.exports = {
  registro,
  login,
};
