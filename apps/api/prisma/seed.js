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

  const seedImagesDir = path.join(__dirname, 'seed_images');

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

  // Copiar archivos multimedia de seed_images a uploads
  const filesToCopy = [
    "herbo.png",
    "franchi.png",
    "durox.png",
    "dsg.png",
    "xoxo.png",
    "chivas.png",
    "eldeposito.png",
    "nuevopuente.png",
    "remax.png",
    "grupomas.png",
    "mastroeni.png",
    "galea.png",
    "paralelo.png",
    "casitadeflor.png",
    "termet.png",
    "victoria.png",
    "ferava.png",
    "amigosecreto.png",
    "poke.png",
    "mac.png",
    "portada_biobox-1779313433294-562662785.png",
    "5-1779310288431-900967158.png",
    "underava.png",
    "soulava.png",
    "foto_perfil.jpeg",
    "Fernando_Gonzalo_Alma_Dileo_CV_Harvard.pdf"
];

  console.log('📁 Copiando archivos multimedia a uploads...');
  filesToCopy.forEach(file => {
    copyFileSafe(seedImagesDir, file, uploadsDir);
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
    update: {
    "id": 1,
    "profilePic": "/uploads/5-1779310288431-900967158.png",
    "jobTitle": "Fullstack Developer",
    "description": "¡Hola! Soy Fernando Gonzalo Alma Dileo, Desarrollador Web Fullstack con tres años de experiencia creando sitios y aplicaciones para empresas, agencias y emprendedores. Recientemente graduado de la Tecnicatura Superior en Programación en la UTN y me encuentro en proceso de especialización en Backend con Java.\n\nDurante mi trayectoria he desarrollado más de 30 proyectos en agencia y varios de forma independiente bajo mi marca personal Soulware, trabajando con tecnologías como Java, Spring Boot, React, Node.js, MySQL, WordPress y WooCommerce.\n\nMe destaco por mi capacidad para resolver problemas, adaptarme a nuevas tecnologías y mantener una comunicación efectiva con clientes y equipos de trabajo. Mi objetivo es aportar soluciones digitales escalables, eficientes y alineadas con las necesidades del negocio, mientras continúo creciendo en entornos profesionales que me desafíen y potencien mis habilidades técnicas y de liderazgo.",
    "cvUrl": "/uploads/Fernando_Gonzalo_Alma_Dileo_CV_Harvard.pdf",
    "githubUrl": "https://github.com/fernando-alma",
    "linkedinUrl": "https://www.linkedin.com/in/fernando-alma",
    "whatsappUrl": "https://wa.me/+5492615407274"
},
    create: {
    "id": 1,
    "profilePic": "/uploads/5-1779310288431-900967158.png",
    "jobTitle": "Fullstack Developer",
    "description": "¡Hola! Soy Fernando Gonzalo Alma Dileo, Desarrollador Web Fullstack con tres años de experiencia creando sitios y aplicaciones para empresas, agencias y emprendedores. Recientemente graduado de la Tecnicatura Superior en Programación en la UTN y me encuentro en proceso de especialización en Backend con Java.\n\nDurante mi trayectoria he desarrollado más de 30 proyectos en agencia y varios de forma independiente bajo mi marca personal Soulware, trabajando con tecnologías como Java, Spring Boot, React, Node.js, MySQL, WordPress y WooCommerce.\n\nMe destaco por mi capacidad para resolver problemas, adaptarme a nuevas tecnologías y mantener una comunicación efectiva con clientes y equipos de trabajo. Mi objetivo es aportar soluciones digitales escalables, eficientes y alineadas con las necesidades del negocio, mientras continúo creciendo en entornos profesionales que me desafíen y potencien mis habilidades técnicas y de liderazgo.",
    "cvUrl": "/uploads/Fernando_Gonzalo_Alma_Dileo_CV_Harvard.pdf",
    "githubUrl": "https://github.com/fernando-alma",
    "linkedinUrl": "https://www.linkedin.com/in/fernando-alma",
    "whatsappUrl": "https://wa.me/+5492615407274"
}
  });
  console.log('✅ Datos de perfil sembrados.');

  // 4. Sembrar Experiencia
  console.log('💼 Sembrando experiencia profesional...');
  await prisma.experience.deleteMany({});
  const experiences = [
    {
        "role": "Programador Web FullStack",
        "company": "Alpha Docere",
        "description": "Liderazgo técnico en célula ágil (Scrum), enfocado en la modernización de sistemas y \narquitectura de software. \n• Microservicios y Modularidad: Lideré la transformación del proyecto \n\"Hackdash\" (Legacy) hacia una arquitectura fullstack independiente y modular, \ndesacoplando la base de datos para garantizar su reutilización y escalabilidad \nen futuras Cohortes. \n• Integración de IA & Automatización: Investigación e implementación de \nherramientas de IA para optimizar el ciclo de desarrollo y la refactorización de \ncódigo. \n• Modernización de Legacy: Mantenimiento, optimización y refactorización de \nproyectos legacy (PHP, HTML, CSS, JS Vanilla), mejorando la documentación y \ndiagramado de sistemas existentes. \n• Gestión de Ciclo de Vida (DevOps): Implementación de flujo de trabajo con Git \ny SourceTree. Git Flow (Feature, Release, Hotfix, Deploy), Code Reviews y \ndespliegue a producción en servidores VPS y compartidos. \n• Speaker & Divulgación: Disertante en el \"AI DAY LOS REYUNOS\" sobre buenas \nprácticas, metodologías colaborativas horizontales y la arquitectura del \nproyecto Hackdash. Host de podcast sobre tecnologías emergentes \n(Blockchain, Ciberseguridad, Spoofing, etc).",
        "startDate": "Noviembre 2025",
        "endDate": "Abril 2026",
        "order": 0
    },
    {
        "role": "Programador Web FullStack",
        "company": "Under Agency – Agencia de Marketing Digital",
        "description": "Lideré el desarrollo y maquetado de sitios web en WordPress, incluyendo landing pages, webs institucionales, inmobiliarias y tiendas e-commerce. Gestioné servidores (WHM, cPanel), hosting, correos y DNS. Integré APIs, pasarelas de pago y personalicé backends con JetEngine. Brindé soporte técnico, resolución de bugs y mejoras continuas, liderando además un equipo de dos desarrolladores en formación.",
        "startDate": "Octubre 2022",
        "endDate": "Marzo 2025",
        "order": 1
    },
    {
        "role": "Fundador y Programador Web FullStack",
        "company": "Soulware – Marca personal",
        "description": "Fundé Soulware, marca personal dedicada al desarrollo de soluciones web personalizadas para clientes locales e internacionales. Gestiono proyectos de inicio a fin, incluyendo diseño UI/UX, desarrollo técnico, branding y presencia digital. Algunos proyectos destacados: Termet, Vera Reciclados, Casita de Flor y Victoria.",
        "startDate": "Julio 2023",
        "endDate": "Presente",
        "order": 2
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
    {
        "role": "Tecnicatura Superior en Programación",
        "company": "UTN – San Rafael",
        "date": "2024 – 2025 (último semestre)",
        "type": "EDUCATION",
        "order": 1
    },
    {
        "role": "ONE | Tech Foundation – Especialización Back-End",
        "company": "Oracle & Alura Latam",
        "date": "2025 – Actualidad",
        "type": "CERTIFICATION",
        "order": 1
    },
    {
        "role": "Diplomatura en Programación Web – FullStack",
        "company": "UTN – Buenos Aires",
        "date": "2023 – 2024",
        "type": "EDUCATION",
        "order": 2
    },
    {
        "role": "Fullstack Java",
        "company": "Codo a Codo 4.0 – Gobierno de CABA",
        "date": "2024",
        "type": "CERTIFICATION",
        "order": 2
    },
    {
        "role": "Desarrollo Web Fullstack (Java)",
        "company": "Egg Cooperation",
        "date": "2021",
        "type": "CERTIFICATION",
        "order": 3
    },
    {
        "role": "Ingeniería en Informática",
        "company": "Universidad de Mendoza",
        "date": "2022 – 2023 (parcial)",
        "type": "EDUCATION",
        "order": 3
    },
    {
        "role": "Ingeniería Electrónica",
        "company": "Universidad de Mendoza",
        "date": "2014 – 2021 (parcial)",
        "type": "EDUCATION",
        "order": 4
    }
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
        "title": "Herbo",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "UNDER AGENCY",
        "description": "E-commerce de baterías para autos y motos.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor",
            "WooCommerce"
        ],
        "image": "/uploads/herbo.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://herbomendoza.com.ar/"
    },
    {
        "title": "Franchi",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "UNDER AGENCY",
        "description": "Web inmobiliaria con sistema interno y API de propiedades.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor"
        ],
        "image": "/uploads/franchi.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://franchiinmobiliaria.com.ar/"
    },
    {
        "title": "Durox",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "UNDER AGENCY",
        "description": "Sitio institucional de insumos para bodegas y enología.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor",
            "WooCommerce"
        ],
        "image": "/uploads/durox.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://sitioseis.soulware.com.ar/"
    },
    {
        "title": "DSG",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "UNDER AGENCY",
        "description": "Web corporativa para empresarios expertos en finanzas.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor"
        ],
        "image": "/uploads/dsg.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://sitiotres.soulware.com.ar/"
    },
    {
        "title": "XOXO",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "UNDER AGENCY",
        "description": "Sitio para discoteca con sistema interno de menú digital.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor",
            "WooCommerce"
        ],
        "image": "/uploads/xoxo.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "#"
    },
    {
        "title": "Chivas",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "UNDER AGENCY",
        "description": "Web institucional de servicios industriales y energéticos.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor"
        ],
        "image": "/uploads/chivas.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://servicioschivas.com.ar/"
    },
    {
        "title": "El Deposito",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "UNDER AGENCY",
        "description": "Sitio institucional de distribución mayorista ferretera.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor"
        ],
        "image": "/uploads/eldeposito.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://eldeposito.com.ar/"
    },
    {
        "title": "Nuevo Puente",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "UNDER AGENCY",
        "description": "Web institucional para tradicional fiambrería mendocina.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor"
        ],
        "image": "/uploads/nuevopuente.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://sitiodos.soulware.com.ar/"
    },
    {
        "title": "REMAX Solutions",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "UNDER AGENCY",
        "description": "Sitio institucional de venta y alquiler de propiedades.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor"
        ],
        "image": "/uploads/remax.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://remaxsolutions.com.ar/"
    },
    {
        "title": "Grupo Más",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "SOULWARE",
        "description": "Sitio institucional de proyectos inmobiliarios en Mendoza.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor"
        ],
        "image": "/uploads/grupomas.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://masdesarrollos.com.ar/"
    },
    {
        "title": "Mastroeni",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "SOULWARE",
        "description": "Web institucional con catálogo de vinos de bodega.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor"
        ],
        "image": "/uploads/mastroeni.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://sitiocinco.soulware.com.ar/"
    },
    {
        "title": "Galea",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "SOULWARE",
        "description": "Inmobiliaria con sistema de carga y sincronización de propiedades.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor"
        ],
        "image": "/uploads/galea.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://galeapropiedades.com.ar/"
    },
    {
        "title": "Paralelo",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "SOULWARE",
        "description": "Sitio institucional de proyectos inmobiliarios innovadores.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor"
        ],
        "image": "/uploads/paralelo.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://sitiocuatro.soulware.com.ar/"
    },
    {
        "title": "Hot House",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "SOULWARE",
        "description": "Web inmobiliaria para campaña Hot Sale de Remax Solutions.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor"
        ],
        "image": "/uploads/remax.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://remaxsolutions.com.ar/"
    },
    {
        "title": "Casita de Flor",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "SOULWARE",
        "description": "E-commerce de arreglos florales y regalos especiales.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor",
            "WooCommerce"
        ],
        "image": "/uploads/casitadeflor.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://casitadeflor.com/"
    },
    {
        "title": "Termet SA",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "SOULWARE",
        "description": "Web institucional de ingeniería en refrigeración y procesos.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor"
        ],
        "image": "/uploads/termet.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://termetsa.com.ar/"
    },
    {
        "title": "Victoria SM",
        "category": "wordpress",
        "categoryLabel": "WordPress",
        "agency": "SOULWARE",
        "description": "Web de sport management y representación deportiva.",
        "longDescription": null,
        "technologies": [
            "WordPress",
            "Elementor"
        ],
        "image": "/uploads/victoria.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": null,
        "webUrl": "https://victoriasm.com.ar/"
    },
    {
        "title": "App de Gestión de Turnos Médicos",
        "category": "fullstack",
        "categoryLabel": "Full Stack",
        "agency": "Proyecto de estudio",
        "description": "App para agenda médica y administración de turnos.",
        "longDescription": null,
        "technologies": [
            "Vue.js",
            "Node.js",
            "MongoDB",
            "Express"
        ],
        "image": "/uploads/ferava.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": "https://github.com/fernando-alma/turnos-medicos",
        "webUrl": "https://turnosmedicos-demo.vercel.app/"
    },
    {
        "title": "App de Homebanking",
        "category": "backend",
        "categoryLabel": "Backend",
        "agency": "Proyecto de estudio",
        "description": "Plataforma bancaria con pagos, transferencias y consultas.",
        "longDescription": null,
        "technologies": [
            "Node.js",
            "Express",
            "MongoDB",
            "JWT"
        ],
        "image": "/uploads/ferava.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": "https://github.com/fernando-alma/homebanking-app",
        "webUrl": "https://homebanking-demo.vercel.app/"
    },
    {
        "title": "Foro Hub",
        "category": "backend",
        "categoryLabel": "Backend",
        "agency": "Proyecto de estudio",
        "description": "Foro educativo con usuarios, categorías y gestión de temas.",
        "longDescription": null,
        "technologies": [
            "Java",
            "Spring Boot",
            "MySQL",
            "JWT"
        ],
        "image": "/uploads/ferava.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": "https://github.com/fernando-alma/forohub",
        "webUrl": "https://forohub-demo.vercel.app/"
    },
    {
        "title": "LiterAlura",
        "category": "backend",
        "categoryLabel": "Backend",
        "agency": "Proyecto de estudio",
        "description": "Aplicación web para explorar y organizar libros online.",
        "longDescription": null,
        "technologies": [
            "Java",
            "Spring Boot",
            "PostgreSQL",
            "REST"
        ],
        "image": "/uploads/ferava.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": "https://github.com/fernando-alma/turnos-medicos",
        "webUrl": "https://turnosmedicos-demo.vercel.app/"
    },
    {
        "title": "Conversor de Monedas",
        "category": "backend",
        "categoryLabel": "Backend",
        "agency": "Proyecto de estudio",
        "description": "Conversor de divisas en tiempo real con tasas actualizadas.",
        "longDescription": null,
        "technologies": [
            "Python",
            "FastAPI",
            "APIs Externas",
            "Redis"
        ],
        "image": "/uploads/ferava.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": "https://github.com/fernando-alma/turnos-medicos",
        "webUrl": "https://turnosmedicos-demo.vercel.app/"
    },
    {
        "title": "Facemask Detection",
        "category": "backend",
        "categoryLabel": "Backend",
        "agency": "Proyecto de estudio",
        "description": "App de IA para detección de uso de mascarillas.",
        "longDescription": null,
        "technologies": [
            "Python",
            "OpenCV",
            "TensorFlow",
            "Flask"
        ],
        "image": "/uploads/ferava.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": "https://github.com/fernando-alma/turnos-medicos",
        "webUrl": "https://turnosmedicos-demo.vercel.app/"
    },
    {
        "title": "Amigo Secreto",
        "category": "frontend",
        "categoryLabel": "Frontend",
        "agency": "Proyecto de estudio",
        "description": "Plataforma online para organizar sorteos de amigo secreto.",
        "longDescription": null,
        "technologies": [
            "HTML5",
            "CSS3",
            "JavaScript",
            "LocalStorage"
        ],
        "image": "/uploads/amigosecreto.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": "https://github.com/fernando-alma/amigo-secreto",
        "webUrl": "https://amigosecreto-demo.vercel.app/"
    },
    {
        "title": "Pokedesk",
        "category": "frontend",
        "categoryLabel": "Frontend",
        "agency": "Proyecto de estudio",
        "description": "Aplicación interactiva con información y filtros de Pokémon.",
        "longDescription": null,
        "technologies": [
            "React",
            "CSS3",
            "PokeAPI",
            "Axios"
        ],
        "image": "/uploads/poke.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": "https://github.com/fernando-alma/turnos-medicos",
        "webUrl": "https://turnosmedicos-demo.vercel.app/"
    },
    {
        "title": "Juego AVATAR",
        "category": "frontend",
        "categoryLabel": "Frontend",
        "agency": "Proyecto de estudio",
        "description": "Videojuego de aventura y combate inspirado en AVATAR.",
        "longDescription": null,
        "technologies": [
            "JavaScript",
            "HTML5 Canvas",
            "CSS3",
            "GSAP"
        ],
        "image": "/uploads/amigosecreto.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": "https://github.com/fernando-alma/turnos-medicos",
        "webUrl": "https://turnosmedicos-demo.vercel.app/"
    },
    {
        "title": "McDonalds Replic",
        "category": "frontend",
        "categoryLabel": "Frontend",
        "agency": "Proyecto de estudio",
        "description": "Réplica web interactiva del menú digital de McDonald's.",
        "longDescription": null,
        "technologies": [
            "HTML5",
            "CSS3",
            "JavaScript",
            "Bootstrap"
        ],
        "image": "/uploads/mac.png",
        "gallery": [],
        "youtubeUrl": null,
        "githubUrl": "https://github.com/fernando-alma/turnos-medicos",
        "webUrl": "https://turnosmedicos-demo.vercel.app/"
    },
    {
        "title": "Visor DICOM",
        "category": "fullstack",
        "categoryLabel": "HealthTech",
        "agency": "Proyecto de estudio",
        "description": "Visor DICOM de grado clínico con arquitectura BFF y análisis asistido por IA.",
        "longDescription": "El Desafío\nDiseñar desde cero la infraestructura completa y el visor de una plataforma de diagnóstico radiológico que centralice estudios médicos con alta seguridad, precisión de grado clínico y escalabilidad real desde POC hasta despliegue institucional hospitalario.\n\nLa Solución\nArquitectura BFF con tres servicios en Docker: dicom-viewer (frontend, puerto 80) + backend-bff (Node.js TypeScript, puerto 3000) + orthanc (PACS, puerto 8042). El BFF actúa como escudo entre la red pública y la infraestructura médica privada. Renderizado 16-bit con Cornerstone.js.\n\nHitos de Ingeniería\n✓\nÍndice Cardiotorácico (ICT): algoritmo asistido para detección de cardiomegalias\n\n✓\nÁngulo de Cobb: medición de desviaciones en columna vertebral\n\n✓\nReconstrucción Multi-Planar (MPR): ejes sagitales y coronales en tiempo real\n\n✓\nSonda Hounsfield (HU): caracterización de tejidos en CT\n\n✓\nExportación PDF con informes radiológicos completos\n\n✓\nInspector de Metadatos DICOM con búsqueda y filtrado",
        "technologies": [
            "Node.js + TypeScript",
            "React 18 + Vite",
            "Cornerstone.js",
            "Orthanc",
            "Docker + Compose",
            "Swagger",
            "WADO-RS"
        ],
        "image": "/uploads/portada_biobox-1779313433294-562662785.png",
        "gallery": [],
        "youtubeUrl": "",
        "githubUrl": "https://github.com/fernando-alma/biobox-platform",
        "webUrl": "https://biobox-platform.vercel.app/"
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
