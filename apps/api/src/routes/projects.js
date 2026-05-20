import express from 'express';
import prisma from '../utils/prisma.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/projects - Obtener todos los proyectos
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ error: 'Error al obtener los proyectos.' });
  }
});

// GET /api/projects/:id - Obtener un proyecto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });
    if (!project) {
      return res.status(404).json({ error: 'Proyecto no encontrado.' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error al obtener el proyecto:', error);
    res.status(500).json({ error: 'Error al obtener el proyecto.' });
  }
});

// POST /api/projects - Crear un nuevo proyecto
router.post('/', requireAuth, async (req, res) => {
  const {
    title,
    category,
    categoryLabel,
    agency,
    description,
    longDescription,
    technologies,
    image,
    gallery,
    youtubeUrl,
    githubUrl,
    webUrl
  } = req.body;

  if (!title || !category || !categoryLabel || !description || !image) {
    return res.status(400).json({ error: 'Título, categoría, etiqueta de categoría, descripción e imagen miniatura son obligatorios.' });
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        title,
        category,
        categoryLabel,
        agency,
        description,
        longDescription,
        technologies: technologies || [],
        image,
        gallery: gallery || [],
        youtubeUrl,
        githubUrl,
        webUrl
      }
    });
    res.status(201).json({ message: 'Proyecto creado con éxito.', project: newProject });
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    res.status(500).json({ error: 'Error al crear el proyecto.' });
  }
});

// PUT /api/projects/:id - Actualizar un proyecto existente
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    category,
    categoryLabel,
    agency,
    description,
    longDescription,
    technologies,
    image,
    gallery,
    youtubeUrl,
    githubUrl,
    webUrl
  } = req.body;

  try {
    const existing = await prisma.project.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Proyecto no encontrado.' });
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title,
        category,
        categoryLabel,
        agency,
        description,
        longDescription,
        technologies: technologies || [],
        image,
        gallery: gallery || [],
        youtubeUrl,
        githubUrl,
        webUrl
      }
    });

    res.json({ message: 'Proyecto actualizado con éxito.', project: updatedProject });
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    res.status(500).json({ error: 'Error al actualizar el proyecto.' });
  }
});

// DELETE /api/projects/:id - Eliminar un proyecto
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.project.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Proyecto no encontrado.' });
    }

    await prisma.project.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Proyecto eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    res.status(500).json({ error: 'Error al eliminar el proyecto.' });
  }
});

export default router;
