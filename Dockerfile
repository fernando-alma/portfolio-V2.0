# Etapa de construcción (Build)
FROM node:lts-alpine AS build-stage

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Etapa de producción (Production)
FROM nginx:stable-alpine AS production-stage

# Copiar los archivos construidos desde la etapa anterior
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
