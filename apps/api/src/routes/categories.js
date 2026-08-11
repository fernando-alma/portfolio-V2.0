import express from 'express';
import prisma from '../utils/prisma.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/categories - Obtener todas las categorías públicas
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [
        { order: 'asc' },
        { id: 'asc' }
      ]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener las categorías.' });
  }
});

// GET /api/categories/:id - Obtener una categoría por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    });
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada.' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error al obtener la categoría:', error);
    res.status(500).json({ error: 'Error al obtener la categoría.' });
  }
});

// POST /api/categories - Crear una nueva categoría (requiere auth)
router.post('/', requireAuth, async (req, res) => {
  const { key, label, icon, order } = req.body;

  if (!key || !label) {
    return res.status(400).json({ error: 'El identificador técnico (key) y el nombre (label) son obligatorios.' });
  }

  const cleanKey = key.toLowerCase().trim().replace(/\s+/g, '-');

  try {
    const existing = await prisma.category.findUnique({
      where: { key: cleanKey }
    });
    if (existing) {
      return res.status(400).json({ error: `La clave de categoría '${cleanKey}' ya existe.` });
    }

    const newCategory = await prisma.category.create({
      data: {
        key: cleanKey,
        label: label.trim(),
        icon: icon ? icon.trim() : '',
        order: order !== undefined && order !== '' ? parseInt(order) : 0
      }
    });

    res.status(201).json({ message: 'Categoría creada con éxito.', category: newCategory });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear la categoría.' });
  }
});

// PUT /api/categories/:id - Actualizar una categoría existente (requiere auth)
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { key, label, icon, order } = req.body;

  if (!key || !label) {
    return res.status(400).json({ error: 'El identificador técnico (key) y el nombre (label) son obligatorios.' });
  }

  const cleanKey = key.toLowerCase().trim().replace(/\s+/g, '-');

  try {
    const existing = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Categoría no encontrada.' });
    }

    // Verificar que la nueva key no esté duplicada con otra categoría
    if (cleanKey !== existing.key) {
      const duplicateKey = await prisma.category.findUnique({ where: { key: cleanKey } });
      if (duplicateKey) {
        return res.status(400).json({ error: `La clave '${cleanKey}' ya está en uso por otra categoría.` });
      }

      // Si cambió la key, actualizar también los proyectos que tenían esa categoría
      await prisma.project.updateMany({
        where: { category: existing.key },
        data: { category: cleanKey, categoryLabel: label.trim() }
      });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        key: cleanKey,
        label: label.trim(),
        icon: icon !== undefined ? icon.trim() : existing.icon,
        order: order !== undefined && order !== '' ? parseInt(order) : existing.order
      }
    });

    res.json({ message: 'Categoría actualizada con éxito.', category: updatedCategory });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ error: 'Error al actualizar la categoría.' });
  }
});

// DELETE /api/categories/:id - Eliminar una categoría (requiere auth)
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.category.findUnique({
      where: { id: parseInt(id) }
    });
    if (!existing) {
      return res.status(404).json({ error: 'Categoría no encontrada.' });
    }

    // Opcional: verificar si existen proyectos utilizando esta categoría
    const projectsUsingCategory = await prisma.project.count({
      where: { category: existing.key }
    });

    if (projectsUsingCategory > 0) {
      return res.status(400).json({
        error: `No se puede eliminar la categoría '${existing.label}' porque hay ${projectsUsingCategory} proyecto(s) asignado(s) a ella.`
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Categoría eliminada con éxito.' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error al eliminar la categoría.' });
  }
});

export default router;
