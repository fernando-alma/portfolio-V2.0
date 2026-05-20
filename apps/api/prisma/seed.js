import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log('🌱 Iniciando el proceso de sembrado (seeding)...');

  // 1. Configurar directorios
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const vueAssetsImgDir = path.join(__dirname, '../../vue-backup/src/assets/img');
  const vueAssetsIconsDir = path.join(__dirname, '../../vue-backup/src/assets/icons');
  const vuePublicCvDir = path.join(__dirname, '../../vue-backup/public/cv');

  // Función auxiliar para copiar archivos de forma segura
  const copyFileSafe = (srcDir, filename, destDir) => {
    const srcPath = path.join(srcDir, filename);
    const destPath = path.join(destDir, filename);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copiado: ${filename} -> /uploads`);
      return `/uploads/${filename}`;
    } else {
      console.log(`⚠️ Archivo no encontrado en origen: ${srcPath}`);
      return null;
    }
  };

  // Copiar Foto de Perfil y CV
  copyFileSafe(vueAssetsImgDir, 'foto_perfil.jpeg', uploadsDir);
  copyFileSafe(vuePublicCvDir, 'Fernando_Gonzalo_Alma_Dileo_CV_Harvard.pdf', uploadsDir);

  // Copiar Avatars
  copyFileSafe(vueAssetsIconsDir, 'underava.png', uploadsDir);
  copyFileSafe(vueAssetsIconsDir, 'soulava.png', uploadsDir);
  copyFileSafe(vueAssetsIconsDir, 'ferava.png', uploadsDir);

  // Lista de imágenes de proyectos a copiar
  const projectImages = [
    'herbo.png', 'franchi.png', 'durox.png', 'dsg.png', 'xoxo.png',
    'chivas.png', 'eldeposito.png', 'nuevopuente.png', 'remax.png',
    'grupomas.png', 'mastroeni.png', 'galea.png', 'paralelo.png',
    'casitadeflor.png', 'termet.png', 'victoria.png', 'amigosecreto.png',
    'poke.png', 'mac.png'
  ];

  projectImages.forEach(img => {
    copyFileSafe(vueAssetsImgDir, img, uploadsDir);
  });

  // 2. Sembrar Administrador (User)
  console.log('👤 Creando usuario administrador...');
  const existingUser = await prisma.user.findFirst({
    where: { username: 'admin' }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword
      }
    });
    console.log('✅ Usuario "admin" creado con contraseña por defecto "admin123"');
  } else {
    console.log('ℹ️ El usuario administrador "admin" ya existe.');
  }

  // 3. Sembrar Sobre Mí (Profile)
  console.log('ℹ️ Sembrando datos de perfil...');
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      profilePic: '/uploads/foto_perfil.jpeg',
      jobTitle: 'FullStack Developer',
      description: `¡Hola! Soy Fernando Gonzalo Alma Dileo, Desarrollador Web Fullstack con tres años de experiencia creando sitios y aplicaciones para empresas, agencias y emprendedores. Recientemente graduado de la Tecnicatura Superior en Programación en la UTN y me encuentro en proceso de especialización en Backend con Java.\n\nDurante mi trayectoria he desarrollado más de 30 proyectos en agencia y varios de forma independiente bajo mi marca personal Soulware, trabajando con tecnologías como Java, Spring Boot, React, Node.js, MySQL, WordPress y WooCommerce.\n\nMe destaco por mi capacidad para resolver problemas, adaptarme a nuevas tecnologías y mantener una comunicación efectiva con clientes y equipos de trabajo. Mi objetivo es aportar soluciones digitales escalables, eficientes y alineadas con las necesidades del negocio, mientras continúo creciendo en entornos profesionales que me desafíen y potencien mis habilidades técnicas y de liderazgo.`,
      cvUrl: '/uploads/Fernando_Gonzalo_Alma_Dileo_CV_Harvard.pdf',
      githubUrl: 'https://github.com/fernando-alma',
      linkedinUrl: 'https://www.linkedin.com/in/fernando-alma',
      whatsappUrl: 'https://wa.me/+5492615407274'
    }
  });
  console.log('✅ Datos de perfil sembrados.');

  // 4. Sembrar Experiencia
  console.log('💼 Sembrando experiencia profesional...');
  await prisma.experience.deleteMany({});
  const experiences = [
    {
      role: 'Programador Web FullStack',
      company: 'Under Agency – Agencia de Marketing Digital',
      startDate: 'Octubre 2022',
      endDate: 'Marzo 2025',
      description: 'Lideré el desarrollo y maquetado de sitios web en WordPress, incluyendo landing pages, webs institucionales, inmobiliarias y tiendas e-commerce. Gestioné servidores (WHM, cPanel), hosting, correos y DNS. Integré APIs, pasarelas de pago y personalicé backends con JetEngine. Brindé soporte técnico, resolución de bugs y mejoras continuas, liderando además un equipo de dos desarrolladores en formación.',
      order: 1
    },
    {
      role: 'Fundador y Programador Web FullStack',
      company: 'Soulware – Marca personal',
      startDate: 'Julio 2023',
      endDate: 'Presente',
      description: 'Fundé Soulware, marca personal dedicada al desarrollo de soluciones web personalizadas para clientes locales e internacionales. Gestiono proyectos de inicio a fin, incluyendo diseño UI/UX, desarrollo técnico, branding y presencia digital. Algunos proyectos destacados: Termet, Vera Reciclados, Casita de Flor y Victoria.',
      order: 2
    }
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }
  console.log('✅ Experiencia profesional sembrada.');

  // 5. Sembrar Educación y Certificaciones
  console.log('🎓 Sembrando educación y certificaciones...');
  await prisma.educationCertification.deleteMany({});
  const educationItems = [
    // Educación
    { role: 'Tecnicatura Superior en Programación', company: 'UTN – San Rafael', date: '2024 – 2025 (último semestre)', type: 'EDUCATION', order: 1 },
    { role: 'Diplomatura en Programación Web – FullStack', company: 'UTN – Buenos Aires', date: '2023 – 2024', type: 'EDUCATION', order: 2 },
    { role: 'Ingeniería en Informática', company: 'Universidad de Mendoza', date: '2022 – 2023 (parcial)', type: 'EDUCATION', order: 3 },
    { role: 'Ingeniería Electrónica', company: 'Universidad de Mendoza', date: '2014 – 2021 (parcial)', type: 'EDUCATION', order: 4 },
    // Certificaciones
    { role: 'ONE | Tech Foundation – Especialización Back-End', company: 'Oracle & Alura Latam', date: '2025 – Actualidad', type: 'CERTIFICATION', order: 1 },
    { role: 'Fullstack Java', company: 'Codo a Codo 4.0 – Gobierno de CABA', date: '2024', type: 'CERTIFICATION', order: 2 },
    { role: 'Desarrollo Web Fullstack (Java)', company: 'Egg Cooperation', date: '2021', type: 'CERTIFICATION', order: 3 }
  ];

  for (const item of educationItems) {
    await prisma.educationCertification.create({ data: item });
  }
  console.log('✅ Educación y certificaciones sembradas.');

  // 6. Sembrar Proyectos
  console.log('📂 Sembrando proyectos del catálogo...');
  await prisma.project.deleteMany({});
  const projects = [
    {
      title: 'Herbo',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'UNDER AGENCY',
      description: 'E-commerce de baterías para autos y motos.',
      technologies: ['WordPress', 'Elementor', 'WooCommerce'],
      image: '/uploads/herbo.png',
      webUrl: 'https://herbomendoza.com.ar/'
    },
    {
      title: 'Franchi',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'UNDER AGENCY',
      description: 'Web inmobiliaria con sistema interno y API de propiedades.',
      technologies: ['WordPress', 'Elementor'],
      image: '/uploads/franchi.png',
      webUrl: 'https://franchiinmobiliaria.com.ar/'
    },
    {
      title: 'Durox',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'UNDER AGENCY',
      description: 'Sitio institucional de insumos para bodegas y enología.',
      technologies: ['WordPress', 'Elementor', 'WooCommerce'],
      image: '/uploads/durox.png',
      webUrl: 'https://sitioseis.soulware.com.ar/'
    },
    {
      title: 'DSG',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'UNDER AGENCY',
      description: 'Web corporativa para empresarios expertos en finanzas.',
      technologies: ['WordPress', 'Elementor'],
      image: '/uploads/dsg.png',
      webUrl: 'https://sitiotres.soulware.com.ar/'
    },
    {
      title: 'XOXO',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'UNDER AGENCY',
      description: 'Sitio para discoteca con sistema interno de menú digital.',
      technologies: ['WordPress', 'Elementor', 'WooCommerce'],
      image: '/uploads/xoxo.png',
      webUrl: '#'
    },
    {
      title: 'Chivas',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'UNDER AGENCY',
      description: 'Web institucional de servicios industriales y energéticos.',
      technologies: ['WordPress', 'Elementor'],
      image: '/uploads/chivas.png',
      webUrl: 'https://servicioschivas.com.ar/'
    },
    {
      title: 'El Deposito',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'UNDER AGENCY',
      description: 'Sitio institucional de distribución mayorista ferretera.',
      technologies: ['WordPress', 'Elementor'],
      image: '/uploads/eldeposito.png',
      webUrl: 'https://eldeposito.com.ar/'
    },
    {
      title: 'Nuevo Puente',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'UNDER AGENCY',
      description: 'Web institucional para tradicional fiambrería mendocina.',
      technologies: ['WordPress', 'Elementor'],
      image: '/uploads/nuevopuente.png',
      webUrl: 'https://sitiodos.soulware.com.ar/'
    },
    {
      title: 'REMAX Solutions',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'UNDER AGENCY',
      description: 'Sitio institucional de venta y alquiler de propiedades.',
      technologies: ['WordPress', 'Elementor'],
      image: '/uploads/remax.png',
      webUrl: 'https://remaxsolutions.com.ar/'
    },
    {
      title: 'Grupo Más',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'SOULWARE',
      description: 'Sitio institucional de proyectos inmobiliarios en Mendoza.',
      technologies: ['WordPress', 'Elementor'],
      image: '/uploads/grupomas.png',
      webUrl: 'https://masdesarrollos.com.ar/'
    },
    {
      title: 'Mastroeni',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'SOULWARE',
      description: 'Web institucional con catálogo de vinos de bodega.',
      technologies: ['WordPress', 'Elementor'],
      image: '/uploads/mastroeni.png',
      webUrl: 'https://sitiocinco.soulware.com.ar/'
    },
    {
      title: 'Galea',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'SOULWARE',
      description: 'Inmobiliaria con sistema de carga y sincronización de propiedades.',
      technologies: ['WordPress', 'Elementor'],
      image: '/uploads/galea.png',
      webUrl: 'https://galeapropiedades.com.ar/'
    },
    {
      title: 'Paralelo',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'SOULWARE',
      description: 'Sitio institucional de proyectos inmobiliarios innovadores.',
      technologies: ['WordPress', 'Elementor'],
      image: '/uploads/paralelo.png',
      webUrl: 'https://sitiocuatro.soulware.com.ar/'
    },
    {
      title: 'Hot House',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'SOULWARE',
      description: 'Web inmobiliaria para campaña Hot Sale de Remax Solutions.',
      technologies: ['WordPress', 'Elementor'],
      image: '/uploads/remax.png',
      webUrl: 'https://remaxsolutions.com.ar/'
    },
    {
      title: 'Casita de Flor',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'SOULWARE',
      description: 'E-commerce de arreglos florales y regalos especiales.',
      technologies: ['WordPress', 'Elementor', 'WooCommerce'],
      image: '/uploads/casitadeflor.png',
      webUrl: 'https://casitadeflor.com/'
    },
    {
      title: 'Termet SA',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'SOULWARE',
      description: 'Web institucional de ingeniería en refrigeración y procesos.',
      technologies: ['WordPress', 'Elementor'],
      image: '/uploads/termet.png',
      webUrl: 'https://termetsa.com.ar/'
    },
    {
      title: 'Victoria SM',
      category: 'wordpress',
      categoryLabel: 'WordPress',
      agency: 'SOULWARE',
      description: 'Web de sport management y representación deportiva.',
      technologies: ['WordPress', 'Elementor'],
      image: '/uploads/victoria.png',
      webUrl: 'https://victoriasm.com.ar/'
    },
    {
      title: 'App de Gestión de Turnos Médicos',
      category: 'fullstack',
      categoryLabel: 'Full Stack',
      agency: 'Proyecto de estudio',
      description: 'App para agenda médica y administración de turnos.',
      technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Express'],
      image: '/uploads/ferava.png',
      webUrl: 'https://turnosmedicos-demo.vercel.app/',
      githubUrl: 'https://github.com/fernando-alma/turnos-medicos'
    },
    {
      title: 'App de Homebanking',
      category: 'backend',
      categoryLabel: 'Backend',
      agency: 'Proyecto de estudio',
      description: 'Plataforma bancaria con pagos, transferencias y consultas.',
      technologies: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      image: '/uploads/ferava.png',
      webUrl: 'https://homebanking-demo.vercel.app/',
      githubUrl: 'https://github.com/fernando-alma/homebanking-app'
    },
    {
      title: 'Foro Hub',
      category: 'backend',
      categoryLabel: 'Backend',
      agency: 'Proyecto de estudio',
      description: 'Foro educativo con usuarios, categorías y gestión de temas.',
      technologies: ['Java', 'Spring Boot', 'MySQL', 'JWT'],
      image: '/uploads/ferava.png',
      webUrl: 'https://forohub-demo.vercel.app/',
      githubUrl: 'https://github.com/fernando-alma/forohub'
    },
    {
      title: 'LiterAlura',
      category: 'backend',
      categoryLabel: 'Backend',
      agency: 'Proyecto de estudio',
      description: 'Aplicación web para explorar y organizar libros online.',
      technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'REST'],
      image: '/uploads/ferava.png',
      webUrl: 'https://turnosmedicos-demo.vercel.app/',
      githubUrl: 'https://github.com/fernando-alma/turnos-medicos'
    },
    {
      title: 'Conversor de Monedas',
      category: 'backend',
      categoryLabel: 'Backend',
      agency: 'Proyecto de estudio',
      description: 'Conversor de divisas en tiempo real con tasas actualizadas.',
      technologies: ['Python', 'FastAPI', 'APIs Externas', 'Redis'],
      image: '/uploads/ferava.png',
      webUrl: 'https://turnosmedicos-demo.vercel.app/',
      githubUrl: 'https://github.com/fernando-alma/turnos-medicos'
    },
    {
      title: 'Facemask Detection',
      category: 'backend',
      categoryLabel: 'Backend',
      agency: 'Proyecto de estudio',
      description: 'App de IA para detección de uso de mascarillas.',
      technologies: ['Python', 'OpenCV', 'TensorFlow', 'Flask'],
      image: '/uploads/ferava.png',
      webUrl: 'https://turnosmedicos-demo.vercel.app/',
      githubUrl: 'https://github.com/fernando-alma/turnos-medicos'
    },
    {
      title: 'Amigo Secreto',
      category: 'frontend',
      categoryLabel: 'Frontend',
      agency: 'Proyecto de estudio',
      description: 'Plataforma online para organizar sorteos de amigo secreto.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage'],
      image: '/uploads/amigosecreto.png',
      webUrl: 'https://amigosecreto-demo.vercel.app/',
      githubUrl: 'https://github.com/fernando-alma/amigo-secreto'
    },
    {
      title: 'Pokedesk',
      category: 'frontend',
      categoryLabel: 'Frontend',
      agency: 'Proyecto de estudio',
      description: 'Aplicación interactiva con información y filtros de Pokémon.',
      technologies: ['React', 'CSS3', 'PokeAPI', 'Axios'],
      image: '/uploads/poke.png',
      webUrl: 'https://turnosmedicos-demo.vercel.app/',
      githubUrl: 'https://github.com/fernando-alma/turnos-medicos'
    },
    {
      title: 'Juego AVATAR',
      category: 'frontend',
      categoryLabel: 'Frontend',
      agency: 'Proyecto de estudio',
      description: 'Videojuego de aventura y combate inspirado en AVATAR.',
      technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'GSAP'],
      image: '/uploads/amigosecreto.png',
      webUrl: 'https://turnosmedicos-demo.vercel.app/',
      githubUrl: 'https://github.com/fernando-alma/turnos-medicos'
    },
    {
      title: 'McDonalds Replic',
      category: 'frontend',
      categoryLabel: 'Frontend',
      agency: 'Proyecto de estudio',
      description: 'Réplica web interactiva del menú digital de McDonald\'s.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
      image: '/uploads/mac.png',
      webUrl: 'https://turnosmedicos-demo.vercel.app/',
      githubUrl: 'https://github.com/fernando-alma/turnos-medicos'
    }
  ];

  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }
  console.log('✅ Catálogo de proyectos sembrado exitosamente.');

  console.log('🌱 Proceso de sembrado finalizado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el sembrado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
