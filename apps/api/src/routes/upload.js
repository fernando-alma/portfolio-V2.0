import express from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  res.json({
    message: 'Archivo subido con éxito.',
    url: fileUrl,
    file: {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    }
  });
});

export default router;
