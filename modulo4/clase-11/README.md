# 🎬 Movies DB - Proyecto Backend Educativo

Un proyecto completo de backend con Node.js, MySQL, JWT y un frontend simple para gestionar películas.

## 📋 Características

- ✅ **Autenticación JWT** con registro y login
- ✅ **Contraseñas encriptadas** con bcrypt
- ✅ **Base de datos relacional** (usuarios, películas, reviews)
- ✅ **Validaciones** con Zod
- ✅ **Sistema de roles** (user, admin)
- ✅ **Dashboard admin** para gestionar películas
- ✅ **Sistema de valoraciones** (reviews)
- ✅ **API RESTful** bien estructurada
- ✅ **Frontend simple** con fetch

## 🏗️ Arquitectura

```
src/
├── config/          # Configuración de base de datos
├── controllers/     # Lógica de controladores
├── middleware/      # Autenticación, validaciones
├── routes/          # Definición de rutas
├── schemas/         # Validaciones con Zod
├── services/        # Lógica de negocio
└── app.js          # Configuración de Express

public/             # Frontend
├── index.html      # Login/Registro
├── movies.html     # Listado de películas
├── dashboard.html  # Panel de admin
└── css/style.css   # Estilos
```

## 🚀 Instalación

### 1. **Base de datos**

Abre MySQL Workbench y ejecuta el archivo `database.sql`:

```sql
-- Copiar y pegar todo el contenido de database.sql en MySQL Workbench
```

O desde la terminal:
```bash
mysql -u root -p < database.sql
```

### 2. **Instalar dependencias**

```bash
npm install
```

### 3. **Configurar variables de entorno**

Copia el contenido de `.env.example` a un nuevo archivo `.env` (ya está hecho):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=movies_db
JWT_SECRET=mi_secreto_jwt_super_seguro
PORT=3000
```

### 4. **Ejecutar servidor**

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará en `http://localhost:3000`

## 📱 Uso

### Accesos de prueba

**Admin:**
- Email: `admin@example.com`
- Contraseña: `password123`

**Usuario Regular:**
- Email: `user@example.com`
- Contraseña: `password123`

### Flujos principales

1. **Registro**: Ir a `/` → Ingresar credenciales
2. **Login**: Ir a `/` → Ingresar credenciales
3. **Ver películas**: `/movies.html` (requiere login)
4. **Valorar película**: Click en película → Seleccionar rating y comentario
5. **Admin dashboard**: `/dashboard.html` (solo si eres admin)
   - Ver películas creadas
   - Crear nuevas películas
   - Editar películas existentes
   - Eliminar películas

## 📚 Endpoints de API

### Autenticación

```
POST   /api/auth/register      # Registrar usuario
POST   /api/auth/login         # Login
GET    /api/auth/profile       # Obtener perfil (requiere token)
```

### Películas

```
GET    /api/movies             # Obtener todas (con filtros opcionales)
GET    /api/movies/:id         # Obtener película específica
GET    /api/movies/genres      # Obtener géneros disponibles
POST   /api/movies             # Crear película (admin)
PUT    /api/movies/:id         # Actualizar película (admin)
DELETE /api/movies/:id         # Eliminar película (admin)
```

### Reviews/Valoraciones

```
POST   /api/reviews                    # Crear/actualizar review
GET    /api/reviews/movie/:movieId     # Obtener reviews de película
GET    /api/reviews/user/my-reviews    # Obtener mis reviews
DELETE /api/reviews/:reviewId          # Eliminar review
```

## 🔑 Conceptos Educativos

### 1. **Autenticación JWT**
```javascript
// Generar token
const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verificar en middleware
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 2. **Encriptación de contraseñas**
```javascript
// Encriptar
const hashedPassword = await bcrypt.hash(password, 10);

// Verificar
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 3. **Validación con Zod**
```javascript
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  name: z.string().min(2, 'Nombre muy corto'),
});
```

### 4. **Relaciones en base de datos**
```sql
-- Users (1) → (Many) Movies
-- Users (1) → (Many) Reviews
-- Movies (1) → (Many) Reviews

FOREIGN KEY (created_by) REFERENCES users(id)
FOREIGN KEY (user_id) REFERENCES users(id)
FOREIGN KEY (movie_id) REFERENCES movies(id)
```

### 5. **Middleware de autenticación**
```javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token no proporcionado' });
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

### 6. **Control de roles**
```javascript
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};
```

## 🗄️ Estructura de Base de Datos

### Tabla `users`
```sql
id (PK)
email (UNIQUE)
password (encriptada)
name
role (user/admin)
created_at
updated_at
```

### Tabla `movies`
```sql
id (PK)
title
description
director
release_year
genre
image_url
created_by (FK → users)
created_at
updated_at
```

### Tabla `reviews`
```sql
id (PK)
user_id (FK → users)
movie_id (FK → movies)
rating (1-5)
comment
created_at
updated_at
UNIQUE(user_id, movie_id) -- Un usuario solo puede valorar una película una vez
```

## 💡 Para la clase

- **Explicar autenticación**: Mostrar cómo se genera y verifica el JWT
- **Mostrar base de datos**: Abrir MySQL Workbench y explorar tablas
- **Debuggear**: Usar DevTools (Network tab) para ver requests/responses
- **Insomnia/Postman**: Probar endpoints sin frontend
- **Variables de entorno**: Explicar por qué usar `.env`
- **Validaciones**: Mostrar cómo Zod evita datos inválidos
- **Relaciones SQL**: Explicar FOREIGN KEYS en MySQL Workbench

## 📝 Mejoras futuras

- [ ] Paginación
- [ ] Búsqueda avanzada
- [ ] Comentarios anidados
- [ ] Sistema de favoritos
- [ ] Notificaciones
- [ ] Upload de imágenes
- [ ] Pruebas unitarias

## 🛠️ Tecnologías

- **Node.js** - Runtime
- **Express** - Framework web
- **MySQL** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **Zod** - Validación de esquemas
- **dotenv** - Variables de entorno
- **CORS** - Control de acceso

## 📞 Preguntas frecuentes

**P: ¿Por qué JWT y no sesiones?**
R: JWT es más escalable en microservicios y APIs. Las sesiones son mejores para aplicaciones monolíticas.

**P: ¿Debo encriptar todas las contraseñas?**
R: ¡SÍ! Nunca almacenes contraseñas en texto plano. Usa bcrypt o similar.

**P: ¿Cómo agrego más campos a usuarios?**
R: 1) Modifica el schema en SQL, 2) Actualiza la validación en Zod, 3) Actualiza el servicio

**P: ¿Puedo usar otra base de datos?**
R: Sí, pero tendrías que cambiar la librería (mongodb, postgres, etc.)

---

¡Éxito con tu clase! 🚀
