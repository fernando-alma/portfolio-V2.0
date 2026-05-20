import express from 'express';
import prisma from '../utils/prisma.js';
import { requireAuth } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/profile
router.get('/', async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { id: 1 } });
    if (!profile) {
      return res.status(404).json({ error: 'Perfil no encontrado.' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener el perfil.' });
  }
});

// PUT /api/profile
router.put('/', requireAuth, async (req, res) => {
  const { profilePic, jobTitle, description, cvUrl, githubUrl, linkedinUrl, whatsappUrl } = req.body;

  try {
    const updatedProfile = await prisma.profile.upsert({
      where: { id: 1 },
      update: {
        profilePic,
        jobTitle,
        description,
        cvUrl,
        githubUrl,
        linkedinUrl,
        whatsappUrl
      },
      create: {
        id: 1,
        profilePic,
        jobTitle,
        description,
        cvUrl,
        githubUrl,
        linkedinUrl,
        whatsappUrl
      }
    });

    res.json({ message: 'Perfil actualizado con éxito.', profile: updatedProfile });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error al actualizar el perfil.' });
  }
});

export default router;
