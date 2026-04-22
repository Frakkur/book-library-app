const { verificarToken, extraerToken } = require('../utils/jwt');

/**
 * Middleware de autenticación
 * Verifica que el usuario tenga un JWT válido
 * Si no, rechaza con 401 Unauthorized
 * 
 * Uso: app.get('/api/ruta-protegida', autenticacion, controlador)
 */
const autenticacion = (req, res, next) => {
  try {
    // Extraer token del header Authorization
    const authHeader = req.headers.authorization;
    const token = extraerToken(authHeader);

    if (!token) {
      return res.status(401).json({
        error: 'Token no proporcionado. Usa: Authorization: Bearer <token>',
      });
    }

    // Verificar que el token sea válido
    const payload = verificarToken(token);
    if (!payload) {
      return res.status(401).json({
        error: 'Token inválido o expirado',
      });
    }

    // Guardar la información del usuario en req para usar en controladores
    req.usuario = payload;
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({ error: 'Error en servidor' });
  }
};

/**
 * Middleware de autorización por rol
 * Verifica que el usuario tenga un rol específico
 * 
 * Uso: app.get('/api/admin-only', autenticacion, autorizar('admin'), controlador)
 */
const autorizar = (rolRequerido) => {
  return (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== rolRequerido) {
      return res.status(403).json({
        error: `Se requiere rol '${rolRequerido}' para acceder a este recurso`,
      });
    }
    next();
  };
};

module.exports = {
  autenticacion,
  autorizar,
};
