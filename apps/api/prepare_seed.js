import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
const seedImagesDir = path.join(__dirname, 'prisma/seed_images');

if (!fs.existsSync(seedImagesDir)) {
  fs.mkdirSync(seedImagesDir, { recursive: true });
}

const filesToCopy = [
  'herbo.png',
  'franchi.png',
  'durox.png',
  'dsg.png',
  'xoxo.png',
  'chivas.png',
  'eldeposito.png',
  'nuevopuente.png',
  'remax.png',
  'grupomas.png',
  'mastroeni.png',
  'galea.png',
  'paralelo.png',
  'casitadeflor.png',
  'termet.png',
  'victoria.png',
  'ferava.png',
  'amigosecreto.png',
  'poke.png',
  'mac.png',
  'portada_biobox-1779313433294-562662785.png',
  '5-1779310288431-900967158.png',
  'underava.png',
  'soulava.png',
  'foto_perfil.jpeg',
  'Fernando_Gonzalo_Alma_Dileo_CV_Harvard.pdf'
];

console.log('🏁 Copiando archivos activos a seed_images...');
let copiedCount = 0;

filesToCopy.forEach(file => {
  const src = path.join(uploadsDir, file);
  const dest = path.join(seedImagesDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copiado: ${file}`);
    copiedCount++;
  } else {
    console.log(`⚠️ Archivo no encontrado: ${file}`);
  }
});

console.log(`🎉 Proceso completado. Se copiaron ${copiedCount} de ${filesToCopy.length} archivos.`);
