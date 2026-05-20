import express from 'express';
import prisma from '../utils/prisma.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/education
router.get('/', async (req, res) => {
  try {
    const educationItems = await prisma.educationCertification.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(educationItems);
  } catch (error) {
    console.error('Error al obtener educación/certificaciones:', error);
    res.status(500).json({ error: 'Error al obtener los registros de educación y certificaciones.' });
  }
});

// POST /api/education
router.post('/', requireAuth, async (req, res) => {
  const { role, company, date, type, order } = req.body;

  if (!role || !company || !date || !type) {
    return res.status(400).json({ error: 'Título/Rol, institución/empresa, fecha y tipo son obligatorios.' });
  }

  if (type !== 'EDUCATION' && type !== 'CERTIFICATION') {
    return res.status(400).json({ error: 'El tipo debe ser EDUCATION o CERTIFICATION.' });
  }

  try {
    const newItem = await prisma.educationCertification.create({
      data: {
        role,
        company,
        date,
        type,
        order: order !== undefined ? parseInt(order) : 0
      }
    });
    res.status(201).json({ message: 'Registro creado con éxito.', item: newItem });
  } catch (error) {
    console.error('Error al crear registro:', error);
    res.status(500).json({ error: 'Error al crear el registro de educación/certificación.' });
  }
});

// PUT /api/education/:id
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { role, company, date, type, order } = req.body;

  try {
    const existing = await prisma.educationCertification.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }

    if (type && type !== 'EDUCATION' && type !== 'CERTIFICATION') {
      return res.status(400).json({ error: 'El tipo debe ser EDUCATION o CERTIFICATION.' });
    }

    const updatedItem = await prisma.educationCertification.update({
      where: { id: parseInt(id) },
      data: {
        role: role || existing.role,
        company: company || existing.company,
        date: date || existing.date,
        type: type || existing.type,
        order: order !== undefined ? parseInt(order) : existing.order
      }
    });

    res.json({ message: 'Registro actualizado con éxito.', item: updatedItem });
  } catch (error) {
    console.error('Error al actualizar registro:', error);
    res.status(500).json({ error: 'Error al actualizar el registro de educación/certificación.' });
  }
});

// DELETE /api/education/:id
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const existing = await prisma.educationCertification.findUnique({ where: { id: parseInt(id) } });
    if (!existing) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }

    await prisma.educationCertification.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Registro eliminado con éxito.' });
  } catch (error) {
    console.error('Error al eliminar registro:', error);
    res.status(500).json({ error: 'Error al eliminar el registro de educación/certificación.' });
  }
});

export default router;
