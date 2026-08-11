import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import projectsRoutes from './routes/projects.js';
import experienceRoutes from './routes/experience.js';
import educationRoutes from './routes/education.js';
import categoriesRoutes from './routes/categories.js';
import uploadRoutes from './routes/upload.js';
import prisma from './utils/prisma.js';

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

// Registrar routers de API
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/upload', uploadRoutes);

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

// Auto-sembrado seguro de categorías si la tabla está vacía en producción
async function ensureCategoriesSeeded() {
  try {
    const count = await prisma.category.count();
    if (count === 0) {
      console.log('🌱 Poblando categorías iniciales...');
      const defaultCategories = [
        { key: 'wordpress', label: 'WordPress', icon: 'fa-wordpress', order: 1 },
        { key: 'frontend', label: 'Frontend', icon: 'fa-code', order: 2 },
        { key: 'backend', label: 'Backend', icon: 'fa-server', order: 3 },
        { key: 'fullstack', label: 'Full Stack', icon: 'fa-layer-group', order: 4 }
      ];
      for (const cat of defaultCategories) {
        await prisma.category.upsert({
          where: { key: cat.key },
          update: { label: cat.label, icon: cat.icon, order: cat.order },
          create: cat
        });
      }
      const existingProjects = await prisma.project.findMany();
      let maxOrder = 4;
      for (const p of existingProjects) {
        if (p.category && p.categoryLabel) {
          const key = p.category.toLowerCase().trim();
          const existingCat = await prisma.category.findUnique({ where: { key } });
          if (!existingCat) {
            maxOrder++;
            await prisma.category.create({
              data: { key, label: p.categoryLabel, icon: 'fa-folder', order: maxOrder }
            });
          }
        }
      }
      console.log('✅ Categorías sembradas automáticamente.');
    }
  } catch (err) {
    console.error('⚠️ Error al verificar/sembrar categorías:', err.message);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📁 Directorio de uploads servido en http://localhost:${PORT}/uploads`);
  console.log(`🌐 Servidor frontend estático apuntando a: ${clientDistPath}`);
  ensureCategoriesSeeded();
});
