# 🎬 Cinesfera

> Red social cinematográfica donde descubres, valoras y compartes tu mundo del cine y las series.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Sequelize-4169E1?style=flat-square&logo=postgresql)](https://postgresql.org)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel)](https://cinesfera.vercel.app)
[![Deployed on Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render)](https://cinesfera-backend.onrender.com)

## 🌐 Demo en producción

**[https://cinesfera.vercel.app](https://cinesfera.vercel.app)**

> ⚠️ El backend está alojado en Render (plan gratuito). La primera petición puede tardar 30-60 segundos en responder mientras el servidor se activa.

---

## ✨ Funcionalidades

- 🔍 **Búsqueda de contenido** — películas y series con información detallada de TMDB
- 🎥 **Página de detalle** — tráiler, reparto, géneros y plataformas de streaming disponibles en España
- ⭐ **Sistema de reseñas** — valoración del 1 al 10 con comentario
- 📋 **Listas personalizadas** — crea y gestiona listas públicas o privadas
- 👥 **Red social** — sigue usuarios, descubre amigos mutuos y ve sus favoritos
- 🤖 **Recomendador con IA** — recomendaciones personalizadas basadas en tus valoraciones y favoritos usando OpenRouter
- 👤 **Perfil de usuario** — estadísticas, reseñas recientes y favoritos
- 🛡️ **Panel de administración** — gestión de usuarios y moderación de reseñas

---

## 🛠️ Stack tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| React 19 + Vite | Framework y bundler |
| Tailwind CSS | Estilos utilitarios |
| shadcn/ui | Componentes base |
| GSAP + ScrollTrigger | Animaciones |
| Axios | Peticiones HTTP |
| React Router DOM | Navegación SPA |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor HTTP |
| Sequelize ORM | Mapeo objeto-relacional |
| PostgreSQL | Base de datos |
| JWT + cookies httpOnly | Autenticación |
| Bcrypt | Hash de contraseñas |
| Cloudinary | Almacenamiento de avatares |
| express-rate-limit | Protección contra fuerza bruta |
| Multer | Subida de ficheros |

### Servicios externos
| Servicio | Uso |
|---|---|
| TMDB API | Datos de películas y series |
| OpenRouter | IA para recomendaciones |
| Cloudinary | CDN de imágenes |
| Vercel | Despliegue del frontend |
| Render | Despliegue del backend y BD |

---

## 🗄️ Modelo de base de datos

```
users ──< lists ──< list_items >── content_cache
users ──< reviews >── content_cache
users ──< follows >── users
```

El esquema SQL completo está disponible en `/database/cinesfera.sql`.

---

## 🚀 Instalación local

### Requisitos previos
- Node.js 18+
- PostgreSQL 15+
- Cuenta en TMDB, Cloudinary y OpenRouter

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Rellena las variables de entorno en .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Rellena VITE_API_URL=http://localhost:3000/api
npm run dev
```

### Base de datos

Importa el esquema desde pgAdmin o ejecuta:

```bash
psql -U postgres -d cinesfera -f database/cinesfera.sql
```

---

## 📁 Estructura del proyecto

```
Cinesfera/
├── backend/
│   ├── config/          # Configuración (DB, Cloudinary, TMDB)
│   ├── controllers/     # Controladores de la API
│   ├── middlewares/     # Auth, validación
│   ├── models/          # Modelos Sequelize
│   ├── routes/          # Definición de endpoints
│   ├── services/        # Lógica de negocio
│   └── utils/           # Logger, helpers
├── frontend/
│   └── src/
│       ├── components/  # Componentes React
│       ├── context/     # AuthContext, DevModeContext
│       ├── hooks/       # Custom hooks
│       └── api.js       # Instancia Axios centralizada
└── database/
    └── cinesfera.sql    # Esquema de la BD
```

---

## 🔐 Variables de entorno

### Backend `.env`
Consulta [`backend/.env.example`](backend/.env.example) para ver todas las variables necesarias.

### Frontend `.env.local`
```
VITE_API_URL=http://localhost:3000/api
```

---

## 👤 Credenciales de prueba
- **Email**: admin@cinesfera.com
- **Contraseña**: password

---

## 📄 Licencia

Este proyecto ha sido desarrollado como Trabajo de Fin de Grado.
