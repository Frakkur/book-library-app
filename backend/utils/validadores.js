const { z } = require('zod');

/**
 * Schema de validación para registro de usuario
 * Verifica que:
 * - nombre sea string no vacío
 * - email sea un email válido
 * - contraseña tenga mínimo 6 caracteres
 */
const schemaRegistro = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  contrasena: z.string().min(6, 'La contraseña debe tener mínimo 6 caracteres'),
});

/**
 * Schema de validación para login
 */
const schemaLogin = z.object({
  email: z.string().email('Email inválido'),
  contrasena: z.string().min(1, 'La contraseña es requerida'),
});

/**
 * Función auxiliar para validar datos
 * @param {Object} schema - Schema de Zod
 * @param {Object} data - Datos a validar
 * @returns {Object} { valido: boolean, datos: Object|null, errores: Object|null }
 */
const validar = (schema, data) => {
  try {
    const datosValidos = schema.parse(data);
    return { valido: true, datos: datosValidos, errores: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errores = error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {});
      return { valido: false, datos: null, errores };
    }
    return { valido: false, datos: null, errores: { general: 'Error en validación' } };
  }
};

module.exports = {
  schemaRegistro,
  schemaLogin,
  validar,
};
