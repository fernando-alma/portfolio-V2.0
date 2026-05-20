# ============================================================
# Dockerfile - Multi-stage Build: React + Express (Monorepo)
# ============================================================
# Arquitectura: pnpm workspace monorepo
#   - apps/client  → React (Vite) → se compila al dist
#   - apps/api     → Express Node.js → sirve la API + el dist del cliente
# ============================================================

# ─────────────────────────────────────────────────────────────
# ETAPA 1: Build del Frontend (React + Sass)
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar archivos de configuración del monorepo
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copiar manifests de cada workspace antes de instalar (mejor caché)
COPY apps/client/package.json ./apps/client/
COPY apps/api/package.json ./apps/api/

# Instalar TODAS las dependencias del monorepo (necesario para el build del cliente)
RUN pnpm install --frozen-lockfile

# Copiar el código fuente del cliente
COPY apps/client ./apps/client

# Ejecutar el build de producción de React/Vite
RUN pnpm --filter client build

# ─────────────────────────────────────────────────────────────
# ETAPA 2: Imagen de Producción (Express + Frontend compilado)
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar archivos de configuración del monorepo
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./

# Copiar el package.json del API (único workspace en producción)
COPY apps/api/package.json ./apps/api/

# Instalar SOLO las dependencias de producción de la API
RUN pnpm install --frozen-lockfile --filter api

# Copiar el código fuente de la API
COPY apps/api ./apps/api

# Copiar los archivos compilados del frontend desde la etapa anterior
# El servidor Express los sirve como archivos estáticos desde /app/apps/client/dist
COPY --from=frontend-builder /app/apps/client/dist ./apps/client/dist

# Generar el cliente de Prisma en producción
RUN pnpm --filter api exec prisma generate

# Crear el directorio de uploads (para archivos subidos por el admin)
RUN mkdir -p ./apps/api/uploads

# Exponer el puerto de la aplicación Express
EXPOSE 3000

# Variables de entorno por defecto (sobreescribibles en EasyPanel)
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio: levanta el servidor Express unificado
CMD ["node", "apps/api/src/server.js"]
