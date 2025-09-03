<template>
  <div class="portfolio-catalog">
    <!-- Header -->
    <div class="catalog-header">
      <h1 class="catalog-title">Portfolio Completo</h1>
      <p class="catalog-subtitle">Explora todos mis proyectos organizados por categorías</p>
    </div>

    <!-- Filters -->
    <div class="filters-container">
      <div class="filters">
        <button 
          v-for="category in categories" 
          :key="category.key"
          @click="setActiveFilter(category.key)"
          :class="['filter-btn', { active: activeFilter === category.key }]"
        >
          <span class="filter-icon">{{ category.icon }}</span>
          {{ category.label }}
          <span class="project-count">({{ category.count }})</span>
        </button>
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="projects-grid">
      <transition-group name="project-card" tag="div" class="grid-container">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id"
          class="project-card"
        >
          <!-- Project Image -->
          <div class="project-image">
            <img :src="project.image" :alt="project.title" />
            <div class="project-overlay">
              <div class="overlay-content">
                <button class="action-btn primary" @click="viewProject(project)">
                  Ver Proyecto
                </button>
                <button class="action-btn secondary" @click="viewDetails(project)">
                  Detalles
                </button>
              </div>
            </div>
          </div>

          <!-- Project Content -->
          <div class="project-content">
            <!-- Category Tag -->
            <div class="category-tags">
              <span :class="['category-tag', project.category.toLowerCase()]">
                {{ project.categoryLabel }}
              </span>
              <span v-if="project.agency" :class="['agency-tag', project.agency.toLowerCase().replace(/\s+/g, '-')]">
                {{ project.agency }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="project-title">{{ project.title }}</h3>

            <!-- Description -->
            <p class="project-description">{{ project.description }}</p>

            <!-- Technologies -->
            <div class="tech-stack">
              <span 
                v-for="tech in project.technologies" 
                :key="tech"
                class="tech-tag"
              >
                {{ tech }}
              </span>
            </div>

            <!-- Author Info -->
            <div class="author-info">
              <div class="author-avatar">
                <img :src="project.author.avatar" :alt="project.author.name" />
              </div>
              <div class="author-details">
                <span class="author-name">{{ project.author.name }}</span>
                <span class="author-role">{{ project.author.role }}</span>
              </div>
              <button class="read-more-btn" @click="viewDetails(project)">
                Leer Más
              </button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Empty State -->
    <div v-if="filteredProjects.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>No se encontraron proyectos</h3>
      <p>Intenta con otra categoría</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PortfolioCatalog',
  data() {
    return {
      activeFilter: 'all',
      projects: [
        // WordPress Projects - UNDER AGENCIA
        {
          id: 1,
          title: 'Herbo',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER - AGENCIA',
          description: 'Desarrollo de sitio web corporativo con enfoque en productos naturales y herbolarios.',
          technologies: ['WordPress', 'PHP', 'CSS3', 'JavaScript'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'UNDER Team',
            role: 'Agencia de Marketing',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 2,
          title: 'Franchi',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER - AGENCIA',
          description: 'Plataforma web para empresa de servicios con integración de sistema de contacto.',
          technologies: ['WordPress', 'PHP', 'MySQL', 'Bootstrap'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'UNDER Team',
            role: 'Agencia de Marketing',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 3,
          title: 'Durox',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER - AGENCIA',
          description: 'Sitio web industrial con catálogo de productos y sistema de consultas.',
          technologies: ['WordPress', 'WooCommerce', 'CSS3', 'jQuery'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'UNDER Team',
            role: 'Agencia de Marketing',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 4,
          title: 'DSG',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER - AGENCIA',
          description: 'Portal web corporativo con gestión de contenido y galería de proyectos.',
          technologies: ['WordPress', 'PHP', 'CSS3', 'JavaScript'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'UNDER Team',
            role: 'Agencia de Marketing',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 5,
          title: 'XOXO',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER - AGENCIA',
          description: 'E-commerce moderno con sistema de pagos integrado y diseño responsive.',
          technologies: ['WordPress', 'WooCommerce', 'Stripe', 'CSS3'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'UNDER Team',
            role: 'Agencia de Marketing',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 6,
          title: 'Chivas',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER - AGENCIA',
          description: 'Sitio web premium para marca de bebidas con experiencia inmersiva.',
          technologies: ['WordPress', 'PHP', 'GSAP', 'CSS3'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'UNDER Team',
            role: 'Agencia de Marketing',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 7,
          title: 'El Deposito',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER - AGENCIA',
          description: 'Portal de almacenamiento con sistema de inventario y gestión online.',
          technologies: ['WordPress', 'PHP', 'MySQL', 'JavaScript'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'UNDER Team',
            role: 'Agencia de Marketing',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 8,
          title: 'Nuevo Puente',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER - AGENCIA',
          description: 'Sitio institucional con información de servicios y contacto empresarial.',
          technologies: ['WordPress', 'PHP', 'CSS3', 'Bootstrap'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'UNDER Team',
            role: 'Agencia de Marketing',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 9,
          title: 'REMAX',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER - AGENCIA',
          description: 'Portal inmobiliario con búsqueda avanzada y galería de propiedades.',
          technologies: ['WordPress', 'PHP', 'Google Maps', 'CSS3'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'UNDER Team',
            role: 'Agencia de Marketing',
            avatar: '/api/placeholder/40/40'
          }
        },
        
        // WordPress Projects - SOULWARE
        {
          id: 10,
          title: 'Grupo Más',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Plataforma corporativa con múltiples secciones y sistema de gestión.',
          technologies: ['WordPress', 'PHP', 'MySQL', 'CSS3'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Desarrollo Personal',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 11,
          title: 'Mastroeni',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Sitio web profesional con portafolio de servicios y testimonios.',
          technologies: ['WordPress', 'PHP', 'jQuery', 'CSS3'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Desarrollo Personal',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 12,
          title: 'Galea',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Portal web con enfoque en servicios especializados y contacto directo.',
          technologies: ['WordPress', 'PHP', 'CSS3', 'JavaScript'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Desarrollo Personal',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 13,
          title: 'Paralelo',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Sitio web creativo con diseño moderno y funcionalidades avanzadas.',
          technologies: ['WordPress', 'PHP', 'GSAP', 'CSS3'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Desarrollo Personal',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 14,
          title: 'Hot House',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Plataforma web para empresa de servicios con integración multimedia.',
          technologies: ['WordPress', 'PHP', 'CSS3', 'Bootstrap'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Desarrollo Personal',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 15,
          title: 'Casita de Flor',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'E-commerce floral con catálogo de productos y sistema de pedidos.',
          technologies: ['WordPress', 'WooCommerce', 'PHP', 'CSS3'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Desarrollo Personal',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 16,
          title: 'Termet SA',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Portal corporativo industrial con información técnica y contactos.',
          technologies: ['WordPress', 'PHP', 'MySQL', 'CSS3'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Desarrollo Personal',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 17,
          title: 'Victoria SM',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Sitio web profesional con gestión de contenido y diseño responsive.',
          technologies: ['WordPress', 'PHP', 'CSS3', 'JavaScript'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Desarrollo Personal',
            avatar: '/api/placeholder/40/40'
          }
        },
        
        // FullStack Projects
        {
          id: 18,
          title: 'App de Gestión de Turnos Médicos',
          category: 'fullstack',
          categoryLabel: 'Full Stack',
          agency: 'SOULWARE',
          description: 'Sistema completo para gestión de citas médicas con panel administrativo.',
          technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Express'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Full Stack Developer',
            avatar: '/api/placeholder/40/40'
          }
        },
        
        // Backend Projects
        {
          id: 19,
          title: 'App de Homebanking',
          category: 'backend',
          categoryLabel: 'Backend',
          agency: 'SOULWARE',
          description: 'API REST para sistema bancario con seguridad avanzada y transacciones.',
          technologies: ['Node.js', 'Express', 'MongoDB', 'JWT'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Backend Developer',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 20,
          title: 'Foro Hub',
          category: 'backend',
          categoryLabel: 'Backend',
          agency: 'SOULWARE',
          description: 'Backend para foro de discusión con sistema de autenticación y moderación.',
          technologies: ['Java', 'Spring Boot', 'MySQL', 'JWT'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Backend Developer',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 21,
          title: 'LiterAlura',
          category: 'backend',
          categoryLabel: 'Backend',
          agency: 'SOULWARE',
          description: 'API para gestión de biblioteca digital con búsqueda avanzada de libros.',
          technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'REST'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Backend Developer',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 22,
          title: 'Conversor de Monedas',
          category: 'backend',
          categoryLabel: 'Backend',
          agency: 'SOULWARE',
          description: 'API para conversión de monedas con tasas de cambio en tiempo real.',
          technologies: ['Python', 'FastAPI', 'APIs Externas', 'Redis'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Backend Developer',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 23,
          title: 'Facemask Detection',
          category: 'backend',
          categoryLabel: 'Backend',
          agency: 'SOULWARE',
          description: 'Sistema de detección de mascarillas usando inteligencia artificial.',
          technologies: ['Python', 'OpenCV', 'TensorFlow', 'Flask'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'AI Developer',
            avatar: '/api/placeholder/40/40'
          }
        },
        
        // Frontend Projects
        {
          id: 24,
          title: 'Amigo Secreto',
          category: 'frontend',
          categoryLabel: 'Frontend',
          agency: 'SOULWARE',
          description: 'Aplicación interactiva para organizar intercambios de regalos.',
          technologies: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Frontend Developer',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 25,
          title: 'Pokedesk',
          category: 'frontend',
          categoryLabel: 'Frontend',
          agency: 'SOULWARE',
          description: 'Pokédex interactiva con búsqueda y detalles de Pokémon.',
          technologies: ['React', 'CSS3', 'PokeAPI', 'Axios'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Frontend Developer',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 26,
          title: 'Juego AVATAR',
          category: 'frontend',
          categoryLabel: 'Frontend',
          agency: 'SOULWARE',
          description: 'Juego interactivo basado en el universo de Avatar con animaciones.',
          technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'GSAP'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Game Developer',
            avatar: '/api/placeholder/40/40'
          }
        },
        {
          id: 27,
          title: 'McDonalds Replic',
          category: 'frontend',
          categoryLabel: 'Frontend',
          agency: 'SOULWARE',
          description: 'Réplica del sitio web de McDonalds con diseño responsive.',
          technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'SOULWARE',
            role: 'Frontend Developer',
            avatar: '/api/placeholder/40/40'
          }
        }
      ]
    }
  },
  computed: {
    categories() {
      const wordpressCount = this.projects.filter(p => p.category === 'wordpress').length;
      const backendCount = this.projects.filter(p => p.category === 'backend').length;
      const frontendCount = this.projects.filter(p => p.category === 'frontend').length;
      const fullstackCount = this.projects.filter(p => p.category === 'fullstack').length;
      
      return [
        { key: 'all', label: 'Todos', icon: '🎯', count: this.projects.length },
        { key: 'wordpress', label: 'WordPress', icon: '🌐', count: wordpressCount },
        { key: 'fullstack', label: 'Full Stack', icon: '⚡', count: fullstackCount },
        { key: 'backend', label: 'Backend', icon: '🔧', count: backendCount },
        { key: 'frontend', label: 'Frontend', icon: '🎨', count: frontendCount }
      ];
    },
    filteredProjects() {
      if (this.activeFilter === 'all') {
        return this.projects;
      }
      return this.projects.filter(project => project.category === this.activeFilter);
    }
  },
  methods: {
    setActiveFilter(filter) {
      this.activeFilter = filter;
    },
    viewProject(project) {
      // Implementar lógica para ver proyecto
      console.log('Ver proyecto:', project.title);
    },
    viewDetails(project) {
      // Implementar lógica para ver detalles
      console.log('Ver detalles:', project.title);
    }
  }
}
</script>

<style scoped>
.portfolio-catalog {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: #1a1a2e;
  min-height: 100vh;
}

/* Header */
.catalog-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.catalog-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #fff, #e3f2fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.catalog-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 0;
}

/* Filters */
.filters-container {
  margin-bottom: 3rem;
  display: flex;
  justify-content: center;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  font-weight: 600;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border-color: white;
}

.filter-icon {
  font-size: 1.2rem;
}

.project-count {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.filter-btn.active .project-count {
  background: #667eea;
  color: white;
}

/* Projects Grid */
.projects-grid {
  margin-bottom: 3rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.project-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
}

/* Project Image */
.project-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #3714e6;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.1);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(102, 126, 234, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.8rem 1.5rem;
  border: 2px solid white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-btn.primary {
  background: white;
  color: #667eea;
}

.action-btn.secondary {
  background: transparent;
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
}

/* Project Content */
.project-content {
  padding: 1.5rem;
}

.category-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.category-tag {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.category-tag.wordpress {
  background: linear-gradient(45deg, #21759b, #2ea2cc);
  color: white;
}

.category-tag.frontend {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
}

.category-tag.backend {
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  color: white;
}

.category-tag.fullstack {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.agency-tag {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 2px solid;
}

.agency-tag.under---agencia {
  border-color: #ff6b6b;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.agency-tag.soulware {
  border-color: #4ecdc4;
  color: #4ecdc4;
  background: rgba(78, 205, 196, 0.1);
}

.project-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.project-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-tag {
  background: #f8f9fa;
  color: #495057;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Author Info */
.author-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #667eea;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-details {
  flex: 1;
}

.author-name {
  display: block;
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.author-role {
  display: block;
  color: #666;
  font-size: 0.8rem;
}

.read-more-btn {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.read-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  opacity: 0.8;
  font-size: 1rem;
}

/* Animations */
.project-card-enter-active,
.project-card-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.project-card-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.project-card-move {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .portfolio-catalog {
    padding: 1rem;
  }
  
  .catalog-title {
    font-size: 2rem;
  }
  
  .catalog-subtitle {
    font-size: 1rem;
  }
  
  .filters {
    gap: 0.5rem;
  }
  
  .filter-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
  
  .grid-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .project-content {
    padding: 1rem;
  }
  
  .project-title {
    font-size: 1.3rem;
  }
  
  .overlay-content {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .action-btn {
    padding: 0.6rem 1.2rem;
  }
}

@media (max-width: 480px) {
  .catalog-header {
    margin-bottom: 2rem;
  }
  
  .filters-container {
    margin-bottom: 2rem;
  }
  
  .category-tags {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .tech-stack {
    gap: 0.3rem;
  }
  
  .tech-tag {
    font-size: 0.75rem;
    padding: 0.2rem 0.4rem;
  }
  
  .author-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .project-card {
    background: #1a1a1a;
    color: #ffffff;
  }
  
  .project-title {
    color: #ffffff;
  }
  
  .project-description {
    color: #cccccc;
  }
  
  .author-name {
    color: #ffffff;
  }
  
  .author-role {
    color: #cccccc;
  }
  
  .tech-tag {
    background: #333333;
    color: #ffffff;
  }
}

/* Loading Animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.loading {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

/* Hover Effects */
.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  z-index: 1;
  pointer-events: none;
}

.project-card:hover::before {
  transform: translateX(100%);
}
</style>