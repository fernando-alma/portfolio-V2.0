import express from 'express';
import prisma from '../utils/prisma.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/experience
router.get('/', async (req, res) => {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(experience);
  } catch (error) {
    console.error('Error al obtener experiencia:', error);
    res.status(500).json({ error: 'Error al obtener la experiencia profesional.' });
  }
});

// POST /api/experience
router.post('/', requireAuth, async (req, res) => {
  const { role, company, startDate, endDate, description, order } = req.body;

  if (!role || !company || !startDate || !description) {
    return res.status(400).json({ error: 'Rol, empresa, fecha de inicio y descripción son obligatorios.' });
  }

  try {
    const newExperience = await prisma.experience.create({
      data: {
        role,
        company,
        startDate,
        endDate,
        description,
        order: order !== undefined ? parseInt(order) : 0
      }
    });
    res.status(201).json({ message: 'Experiencia creada con éxito.', experience: newExperience });
  } catch (error) {
    console.error('Error al crear experiencia:', error);
    res.status(500).json({ error: 'Error al crear el registro de experiencia.' });
  }
});

// PUT /api/experience/:id
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { role, company, startDate, endDate, description, order } = req.body;

  try {
    const existing = await prisma.experience.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Registro de experiencia no encontrado.' });
    }

    const updatedExperience = await prisma.experience.update({
      where: { id: parseInt(id) },
      data: {
        role,
        company,
        startDate,
        endDate,
        description,
        order: order !== undefined ? parseInt(order) : existing.order
      }
    });

    res.json({ message: 'Experiencia actualizada con éxito.', experience: updatedExperience });
  } catch (error) {
    console.error('Error al actualizar experiencia:', error);
    res.status(500).json({ error: 'Error al actualizar el registro de experiencia.' });
  }
});

// DELETE /api/experience/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.experience.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Registro de experiencia no encontrado.' });
    }

    await prisma.experience.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Registro de experiencia eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar experiencia:', error);
    res.status(500).json({ error: 'Error al eliminar el registro de experiencia.' });
  }
});

export default router;
