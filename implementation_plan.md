# Migración y Refactorización de Portfolio a FullStack (React + Node.js + PostgreSQL)

Este documento detalla la planificación técnica, arquitectura, diseño de base de datos y roadmap para la migración del portfolio a una estructura full-stack con un panel de administración dinámico.

## 1. Confirmación de Arquitectura y Entorno (EasyPanel)

Comprendo perfectamente la arquitectura y el entorno de despliegue en el VPS de Contabo con **EasyPanel** (que funciona sobre Docker). 

Dado que el despliegue es continuo (CI/CD desde GitHub), cada vez que se hace un `git push`, EasyPanel destruye los contenedores antiguos y crea unos nuevos basados en las imágenes construidas. Para que esto funcione de forma fluida en un entorno FullStack dinámico:
1. **Esquema Multi-Servicio:** Definiremos dos servicios en EasyPanel (un frontend y un backend) o utilizaremos un esquema de Docker Compose que levante:
   - **Contenedor 1 (Frontend):** React + Sass servido con Nginx.
   - **Contenedor 2 (Backend):** Node.js + Express API.
   - **Contenedor 3 (Base de datos):** PostgreSQL (administrado e inicializado directamente por EasyPanel, lo que facilita backups y credenciales).
2. **Orquestación en Monorepo:** Mantendremos todo en un único repositorio Git organizado como Monorepo usando `pnpm workspaces`. EasyPanel permite apuntar múltiples servicios al mismo repositorio, especificando un directorio origen diferente para cada uno (ej. `/apps/api` y `/apps/client`).

---

## 2. Diseño del Esquema de la Base de Datos (schema.prisma)

Utilizaremos **Prisma ORM** con **PostgreSQL**. A continuación se presenta el diseño completo de `schema.prisma` adaptado a las necesidades de administración dinámica y el histórico de datos.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum EducationType {
  EDUCATION
  CERTIFICATION
}

// Único administrador para acceso al panel
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String   // Contraseña hasheada (bcrypt o argon2)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Configuración y datos de la sección "Sobre Mí" (Mis Datos)
model Profile {
  id          Int      @id @default(1) // Singleton (siempre ID 1)
  profilePic  String   // URL o path de la foto de perfil en el servidor
  jobTitle    String   // Ej. "FullStack Developer"
  description String   @db.Text
  cvUrl       String?  // URL o path del archivo PDF del CV
  githubUrl   String?
  linkedinUrl String?
  whatsappUrl String?
  updatedAt   DateTime @updatedAt
}

// Historial de Experiencia Profesional
model Experience {
  id          Int      @id @default(autoincrement())
  role        String   // Ej. "Programador Web FullStack"
  company     String   // Ej. "Under Agency"
  description String   @db.Text
  startDate   String   // Ej. "Octubre 2022"
  endDate     String?  // Ej. "Marzo 2025" (Null o vacío para "Presente")
  order       Int      @default(0) // Para ordenar en el frontend
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Educación y Certificaciones unificadas para simplicidad con filtro por tipo
model EducationCertification {
  id        Int           @id @default(autoincrement())
  role      String        // Título obtenido o curso
  company   String        // Institución (ej. UTN, Oracle)
  date      String        // Ej. "2024 – 2025" o "2025 – Actualidad"
  type      EducationType // Enum para diferenciar educación de certificaciones
  order     Int           @default(0)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

// Proyectos del Catálogo
model Project {
  id              Int      @id @default(autoincrement())
  title           String
  category        String   // Categoría técnica para filtros (ej: 'wordpress', 'fullstack', 'backend', 'frontend')
  categoryLabel   String   // Nombre legible en UI (ej: 'WordPress', 'Full Stack')
  agency          String?  // Agencia o autor original (ej: 'UNDER AGENCY', 'SOULWARE')
  description     String   @db.Text // Descripción corta
  longDescription String?  @db.Text // Descripción larga detallada (Nueva funcionalidad)
  technologies    String[] // Array nativo de PostgreSQL para tags de tecnologías
  image           String   // Path/URL de la imagen miniatura principal
  gallery         String[] // Array nativo de PostgreSQL para imágenes extra (Nueva funcionalidad)
  youtubeUrl      String?  // Enlace para renderizar video en detalle (Nueva funcionalidad)
  githubUrl       String?  // Opcional para proyectos sin código abierto (ej. WordPress)
  webUrl          String?  // Enlace de producción
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## 3. Estructura del Monorepo sugerida (pnpm)

Adoptaremos una arquitectura de **Monorepo** gestionado con `pnpm workspaces`. Esto nos permite mantener un solo repositorio git, compartir tipos/configuraciones y desplegar Frontend y API de forma independiente en EasyPanel.

```text
portfolio-monorepo/
├── pnpm-workspace.yaml          # Define los directorios de trabajo
├── package.json                 # Scripts globales del monorepo
├── pnpm-lock.yaml               # Lockfile único y optimizado
├── docker-compose.yml           # (Opcional) Para desarrollo local integrado
├── .gitignore
├── README.md
├── apps/
│   ├── client/                  # Frontend: React + Sass (Vite)
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── index.html
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   │   ├── styles/      # Estructura Sass (variables.scss, main.scss, mixins)
│   │   │   │   └── img/         # Imágenes estáticas fijas (no dinámicas)
│   │   │   ├── components/      # Componentes UI de la web pública (NavBar, Catalog, About, etc.)
│   │   │   ├── pages/           # Vistas (Home, ProyectoDetalle, PanelAdminLogin, PanelAdminCRUD)
│   │   │   ├── context/         # AuthContext para validar el estado del JWT del Admin
│   │   │   ├── router/          # Configuración de React Router
│   │   │   └── main.jsx
│   │   └── public/              # Robots.txt, favicon, etc.
│   │
│   └── api/                     # Backend: Node.js + Express + Prisma (API REST)
│       ├── package.json
│       ├── src/
│       │   ├── server.js        # Inicialización del servidor Express
│       │   ├── controllers/     # Lógica de endpoints (auth, projects, experiences, etc.)
│       │   ├── middleware/      # Validador de JWT y subida de archivos (multer)
│       │   ├── routes/          # Rutas de la API (/api/auth, /api/projects, etc.)
│       │   └── utils/           # Ayudantes (encriptación, generador de tokens)
│       ├── prisma/
│       │   ├── schema.prisma    # Esquema de Prisma
│       │   └── seed.js          # Script de extracción y siembra de datos actuales
│       └── uploads/             # Carpeta local para almacenamiento persistente de imágenes
```

---

## 4. Persistencia de Imágenes en Docker / EasyPanel

Cuando subamos imágenes desde el Panel de Administración (como fotos de proyectos o el avatar del perfil), estas se guardarán en el disco duro del VPS para que no se borren en cada actualización automática de GitHub.

### Estrategia de Configuración en EasyPanel:
1. En la consola de administración de **EasyPanel**, ingresaremos a la configuración del servicio del **Backend** (`api`).
2. Buscaremos la pestaña **Mounts** (o **Volumes**).
3. Crearemos un montaje persistente:
   - **Name:** `portfolio-uploads`
   - **Path in Container:** `/app/apps/api/uploads` (la ruta absoluta de la carpeta de subidas dentro de la imagen de producción).
4. **Resultado:** EasyPanel mapeará una carpeta del sistema de archivos del host (VPS) al contenedor. Cuando ocurra un nuevo despliegue desde GitHub, Docker conservará el volumen intacto y lo re-asociará al nuevo contenedor.

### Manejo de Archivos en el API y Frontend:
- Utilizaremos **Multer** como middleware de Express en el Backend para gestionar la carga de archivos, asignando nombres únicos basados en marcas de tiempo (timestamp).
- Serviremos la carpeta de uploads de manera estática en Express:
  ```javascript
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  ```
- Las URLs que guardaremos en la Base de Datos tendrán el formato `/uploads/nombre-de-imagen.jpg`. El Frontend React compondrá la URL completa (ej. `https://fernandoalma.com.ar/api/uploads/nombre-de-imagen.jpg`).

---

## 5. Roadmap de Ejecución Paso a Paso (Fases)

### Fase 1: Inicialización del Monorepo y Estructura Base
- [ ] Configurar el espacio de trabajo de `pnpm` (`pnpm-workspace.yaml`).
- [ ] Inicializar la aplicación React.js + Sass usando Vite en `/apps/client`.
- [ ] Inicializar el proyecto Node.js + Express + Prisma en `/apps/api`.
- [ ] Configurar variables de entorno y conexión local a base de datos para desarrollo.

### Fase 2: Modelado de Datos y Script de Sembrado (Seeding)
- [ ] Crear el archivo `schema.prisma` en `/apps/api/prisma`.
- [ ] Ejecutar migraciones iniciales para crear las tablas en PostgreSQL.
- [ ] **Extracción y Seeding:** Diseñar un script (`seed.js`) que tome los objetos actuales de Vue.js (los 27 proyectos, sobre mí, educación y certificaciones) e inyecte los registros iniciales y las rutas de imágenes en la base de datos PostgreSQL.

### Fase 3: API REST - Autenticación y Endpoints del CRUD
- [ ] Implementar el sistema de login administrativo con JWT y encriptación de contraseñas.
- [ ] Desarrollar los controladores de lectura pública (endpoints libres de GET para obtener experiencias, educación, proyectos y perfil).
- [ ] Desarrollar middlewares de seguridad para validar el token JWT en peticiones de modificación.
- [ ] Desarrollar controladores de escritura protegidos (CRUD de proyectos, experiencias, educación/certificaciones y perfil).
- [ ] Implementar configuración de Multer para la subida y guardado de archivos de imagen y CV en la carpeta local `/uploads`.

### Fase 4: Migración del Frontend Público (React + Sass)
- [ ] Migrar el diseño, HTML y lógica CSS actual de Vue.js a componentes React (`.jsx`) usando Sass (`.scss`).
- [ ] Crear el ruteo básico con `react-router-dom` (Página de Inicio con secciones e integración de sliders).
- [ ] Reemplazar los datos estáticos del Frontend por peticiones Fetch/Axios a la API pública.
- [ ] **Página Dinámica del Proyecto (`/proyecto/:id`):** Diseñar y maquetar una interfaz responsive premium que consuma los nuevos campos (descripción larga, galería de fotos extra y renderizador del reproductor de YouTube).

### Fase 5: Panel de Administración Mobile-First (`/panel-admin`)
- [ ] Crear la página de login protegida.
- [ ] Desarrollar el panel general (dashboard) con navegación fluida y responsive para celulares.
- [ ] Implementar los formularios y vistas CRUD para cada sección (Mis Datos, Experiencia, Educación/Certificaciones).
- [ ] Implementar el formulario CRUD para Proyectos, incorporando campos para subir imágenes (miniatura y galería) y autocompletado/adición de tecnologías.
- [ ] Agregar etiquetas meta `noindex` a todas las rutas administrativas para que no se indexen en Google u otros buscadores.

### Fase 6: DevOps y Despliegue en EasyPanel (VPS Contabo)
- [ ] Crear la aplicación en EasyPanel.
- [ ] Configurar el contenedor de base de datos PostgreSQL.
- [ ] Configurar las variables de entorno de la API (DB URL, JWT Secret, etc.).
- [ ] Configurar el volumen persistente (Mount) de `/uploads` en EasyPanel.
- [ ] Desplegar la API y el Frontend React, automatizando el webhook de GitHub.
- [ ] Realizar pruebas de subida de imágenes y forzar un redepoly para verificar que la persistencia funcione correctamente.

---

## Preguntas Abiertas & Decisiones de Diseño

> [!IMPORTANT]
> **1. Almacenamiento de Archivos Actuales:** Durante el seeding, las imágenes de perfil (`foto_perfil.jpeg`) y miniaturas de proyectos que ya existen en el frontend actual, ¿se mantendrán cargadas como estáticos del cliente o prefieres que el script de seed las copie directamente a la carpeta `/uploads` del backend para centralizar todo el contenido multimedia?
>
> **2. Enlace de YouTube:** Para la nueva funcionalidad de video de proyectos, ¿el administrador ingresará la URL completa del video (ej. `https://www.youtube.com/watch?v=XXXXXX`) y el frontend se encargará de extraer el ID para renderizar el iframe embebido de YouTube de forma automática?
