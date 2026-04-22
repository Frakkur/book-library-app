const { z } = require('zod');

const schemaRegistro = z.object({
  nombre:     z.string().min(1, 'El nombre es requerido'),
  email:      z.string().email('Email inválido'),
  contrasena: z.string().min(6, 'La contraseña debe tener mínimo 6 caracteres'),
});

const schemaLogin = z.object({
  email:      z.string().email('Email inválido'),
  contrasena: z.string().min(1, 'La contraseña es requerida'),
});

const schemaLibro = z.object({
  titulo:           z.string().min(1, 'El título es requerido'),
  autor:            z.string().min(1, 'El autor es requerido'),
  total_paginas:    z.number().int().positive('El total de páginas debe ser mayor a 0'),
  descripcion:      z.string().optional(),
  genero:           z.string().optional(),
  anio_publicacion: z.number().int().min(1000).max(2100).optional(),
  imagen_url:       z.string().url('URL inválida').optional().or(z.literal('')),
});

/**
 * Valida `data` contra `schema` y devuelve un objeto uniforme.
 * @returns {{ valido: boolean, datos: object|null, errores: object|null }}
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

module.exports = { schemaRegistro, schemaLogin, schemaLibro, validar };