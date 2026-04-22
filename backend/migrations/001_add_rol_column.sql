-- Migración 001: Agregar rol a usuarios
-- Ejecuta estos comandos en PostgreSQL:

-- 1. Verificar si la columna 'rol' existe, si no, añadirla
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS rol VARCHAR(50) DEFAULT 'usuario';

-- 2. Asegurar que la contraseña tenga suficiente espacio para bcrypt
-- bcrypt genera hashes de 60 caracteres, así que aumentamos a 255
ALTER TABLE usuarios 
ALTER COLUMN contrasena TYPE VARCHAR(255);

-- 3. Crear índice en email para búsquedas más rápidas
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- 4. Ver la estructura actualizada (opcional)
-- \d usuarios
