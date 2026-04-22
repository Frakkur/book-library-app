const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';

/**
 * Generar un JWT token
 * @param {Object} payload - Datos del usuario (id, email, rol)
 * @returns {string} Token JWT
 */
const generarToken = (payload) => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
      algorithm: 'HS256', // Algoritmo seguro
    });
    return token;
  } catch (error) {
    console.error('Error generando JWT:', error);
    throw new Error('No se pudo generar el token');
  }
};

/**
 * Verificar un JWT token
 * @param {string} token - Token a verificar
 * @returns {Object} Payload decodificado o null si es inválido
 */
const verificarToken = (token) => {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error('Error verificando JWT:', error.message);
    return null;
  }
};

/**
 * Extraer token del header Authorization
 * Formato esperado: "Bearer <token>"
 * @param {string} authHeader - Header Authorization
 * @returns {string|null} Token o null
 */
const extraerToken = (authHeader) => {
  if (!authHeader) return null;
  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') return null;
  return partes[1];
};

module.exports = {
  generarToken,
  verificarToken,
  extraerToken,
};
