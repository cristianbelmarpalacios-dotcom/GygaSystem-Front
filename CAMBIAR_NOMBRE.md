# Cómo cambiar el nombre del proyecto

Cuando estés listo para darle un nombre definitivo a tu proyecto, sigue estos pasos:

## Archivos a modificar:

1. **package.json**
   - Cambia el campo `"name"` por el nombre que desees

2. **README.md**
   - Actualiza el título y la descripción

3. **src/app/layout.tsx**
   - Modifica el `title` y `description` en el objeto `metadata`

4. **next.config.js** (opcional)
   - Si necesitas cambiar configuraciones específicas del nombre

## Ejemplo:

Si quieres llamarlo "TechStore PC Builder":

1. En `package.json`: `"name": "techstore-pc-builder"`
2. En `README.md`: Cambia el título a "TechStore PC Builder"
3. En `src/app/layout.tsx`: 
   ```typescript
   title: 'TechStore PC Builder',
   description: 'Arma tu PC personalizado en TechStore',
   ```

¡Eso es todo! El proyecto está diseñado para que cambiar el nombre sea simple y no afecte la funcionalidad.

