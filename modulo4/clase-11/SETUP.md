# 🚀 Guía de Instalación Paso a Paso

## Paso 1: Requisitos previos

Asegúrate de tener instalado:
- **Node.js** (versión 14+) - Descarga en https://nodejs.org/
- **MySQL Server** - Descarga en https://www.mysql.com/downloads/mysql/
- **MySQL Workbench** - Descarga en https://www.mysql.com/products/workbench/
- Un editor de código (VS Code recomendado)

Verifica las instalaciones en terminal:
```bash
node --version
npm --version
mysql --version
```

## Paso 2: Crear la base de datos

1. Abre **MySQL Workbench**
2. Conéctate a tu servidor MySQL con:
   - Host: `localhost`
   - Username: `root`
   - Password: tu contraseña de MySQL

3. En una nueva pestaña de query, copia TODO el contenido de `database.sql`

4. Ejecuta el script (Ctrl+Shift+Enter o el botón de play)

5. En el panel izquierdo, deberías ver la base de datos `movies_db` con 3 tablas:
   - `users`
   - `movies`
   - `reviews`

## Paso 3: Instalar dependencias del proyecto

Abre una terminal en la carpeta `proyecto-backend`:

```bash
npm install
```

Esto creará una carpeta `node_modules` con todas las librerías necesarias.

## Paso 4: Verificar archivo .env

El archivo `.env` ya debería estar en la raíz del proyecto con:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=movies_db
DB_PORT=3306
JWT_SECRET=mi_secreto_jwt_super_seguro_12345
JWT_EXPIRE=24h
PORT=3000
NODE_ENV=development
```

**IMPORTANTE**: Si tu contraseña de MySQL es diferente, actualiza `DB_PASSWORD`

## Paso 5: Ejecutar el servidor

En la terminal:

```bash
npm run dev
```

Deberías ver:
```
✅ Servidor ejecutándose en http://localhost:3000
📊 Accede a http://localhost:3000 en tu navegador
```

## Paso 6: Probar la aplicación

1. Abre tu navegador en: `http://localhost:3000`

2. Usa las credenciales de prueba:
   - **Email**: `admin@example.com`
   - **Contraseña**: `password123`

3. ¡Deberías ver el dashboard admin!

## Solución de problemas

### Error: "Cannot find module 'express'"
**Solución**: No ejecutaste `npm install`. Corre: `npm install`

### Error: "Error connecting to database"
**Soluciones**:
- Verifica que MySQL está corriendo
- Verifica `DB_PASSWORD` en `.env`
- Verifica que la base de datos `movies_db` existe en MySQL Workbench
- Verifica que creaste las tablas ejecutando `database.sql`

### Error: "Port 3000 is already in use"
**Solución**: Cambia el PORT en `.env` a otro número (ej: 3001)

### Error: CORS origin not allowed
**Solución**: Asegúrate de acceder desde `http://localhost:3000` exactamente

### Las películas de ejemplo no aparecen
**Soluciones**:
- Verifica que ejecutaste el script `database.sql` completo
- Revisa en MySQL Workbench: `SELECT * FROM movies;`
- Si la tabla está vacía, las contraseñas de prueba también están encriptadas incorrectamente

Para datos de prueba reales, registra un nuevo admin o usuario desde el frontend.

## Estructura de carpetas importante

```
proyecto-backend/
│
├── src/
│   ├── config/
│   │   └── database.js           ← Conexión MySQL
│   ├── controllers/
│   │   ├── authController.js     ← Lógica de login/registro
│   │   ├── moviesController.js   ← Lógica de películas
│   │   └── reviewsController.js  ← Lógica de valoraciones
│   ├── middleware/
│   │   ├── auth.js               ← Verificación de JWT
│   │   └── validation.js         ← Validaciones con Zod
│   ├── routes/
│   │   ├── auth.js               ← Rutas de autenticación
│   │   ├── movies.js             ← Rutas de películas
│   │   └── reviews.js            ← Rutas de reviews
│   ├── schemas/
│   │   └── validations.js        ← Esquemas Zod
│   ├── services/
│   │   ├── userService.js        ← Lógica de usuarios
│   │   ├── movieService.js       ← Lógica de películas
│   │   └── reviewService.js      ← Lógica de reviews
│   └── app.js                    ← Configuración Express
│
├── public/                       ← Frontend (HTML/CSS/JS)
│   ├── index.html               ← Login/Registro
│   ├── movies.html              ← Ver películas
│   ├── dashboard.html           ← Panel admin
│   └── css/
│       └── style.css            ← Estilos
│
├── .env                         ← Variables de entorno (IMPORTANTE)
├── database.sql                 ← Script para crear BD
├── package.json                 ← Dependencias
├── README.md                    ← Documentación
├── SETUP.md                     ← Este archivo
└── server.js                    ← Punto de entrada
```

## Comandos útiles

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo (con auto-reload)
npm run dev

# Ejecutar en producción
npm start

# Ver logs en tiempo real
npm run dev

# Detener servidor
Ctrl + C
```

## Flujo de autenticación (para entender el código)

1. **Usuario ingresa email/contraseña** en `index.html`
2. **Frontend envía POST** a `/api/auth/login`
3. **Backend verifica contraseña** con bcrypt
4. **Backend genera JWT** con ID y rol
5. **Frontend guarda JWT** en localStorage
6. **Frontend redirige** a `/movies.html` o `/dashboard.html`
7. **Cada request** envía el JWT en header: `Authorization: Bearer TOKEN`
8. **Middleware verifica** que el JWT sea válido

## Próximos pasos para la clase

1. **Muestra la estructura**: Abre el código en VS Code
2. **Explica JWT**: Abre DevTools → Network → Login → Ver headers
3. **Muestra base de datos**: Abre MySQL Workbench → Explora tablas y relaciones
4. **Experimenta**: Crea películas, valóralas, edita como admin
5. **Debuggea**: Usa `console.log()` en los servicios para ver qué pasa
6. **Modifica**: Intenta cambiar campos o agregar features nuevas

## ¿Necesitas ayuda?

- Revisa el archivo `README.md` para más detalles
- Chequea los comentarios en el código
- Verifica que MySQL esté ejecutándose
- Asegúrate de que las variables de `.env` son correctas

¡Buena suerte! 🎬
