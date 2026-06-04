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

RUN apk update && apk add --no-cache openssl
RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/client/package.json ./apps/client/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile

COPY apps/client ./apps/client
RUN pnpm --filter client build

# ─────────────────────────────────────────────────────────────
# ETAPA 2: Imagen de Producción (Express + Frontend compilado)
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

RUN apk update && apk add --no-cache openssl
RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile --filter api

COPY apps/api ./apps/api
COPY --from=frontend-builder /app/apps/client/dist ./apps/client/dist

RUN pnpm --filter api exec prisma generate

RUN mkdir -p ./apps/api/uploads

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["sh", "-c", "pnpm --filter api exec prisma migrate deploy && node apps/api/src/server.js"]