import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir la carpeta de subidas (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas de la API (Endpoints base)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API unificada del Portfolio funcionando correctamente' });
});

// En producción, servir los archivos del frontend compilado (React)
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Fallback para React Router (SPA) en rutas que no sean de la API
app.get('*', (req, res) => {
  // Evitar interceptar peticiones de la API que no existen
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint de API no encontrado' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📁 Directorio de uploads servido en http://localhost:${PORT}/uploads`);
  console.log(`🌐 Servidor frontend estático apuntando a: ${clientDistPath}`);
});
