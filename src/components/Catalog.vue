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
                  GitHub
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
              <div class="bottom-buttons">
                <button class="read-more-btn" @click="viewDetails(project)">
                Ver Proyecto
              </button>
              <button class="read-more-btn" @click="viewDetails(project)">
                GitHub
              </button></div>
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
        {
          id: 1,
          title: 'Herbo',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER AGENCY', // Cambiado
          description: 'E-commerce de baterías para autos y motos.',
          technologies: ['WordPress', 'Elementor', 'WooCommerce'],
          image: require("@/assets/img/herbo.png"),
          author: {
            name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        {
          id: 2,
          title: 'Franchi',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER AGENCY', // Cambiado
          description: 'Web inmobiliaria con sistema interno y API de propiedades.',
          technologies: ['WordPress', 'Elementor'],
          image: require("@/assets/img/franchi.png"),
          author: {
            name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        {
          id: 3,
          title: 'Durox',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER AGENCY',
          description: 'Sitio institucional de insumos para bodegas y enología.',
          technologies: ['WordPress', 'Elementor', 'WooCommerce'],
          image: require("@/assets/img/durox.png"),
          author: {
           name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        {
          id: 4,
          title: 'DSG',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER AGENCY',
          description: 'Web corporativa para empresarios expertos en finanzas.',
          technologies: ['WordPress', 'Elementor'],
          image: require("@/assets/img/dsg.png"),
          author: {
            name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        {
          id: 5,
          title: 'XOXO',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER AGENCY',
          description: 'Sitio para discoteca con sistema interno de menú digital.',
          technologies: ['WordPress', 'Elementor', 'WooCommerce'],
          image: require("@/assets/img/xoxo.png"),
          author: {
             name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        {
          id: 6,
          title: 'Chivas',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER AGENCY',
          description: 'Web institucional de servicios industriales y energéticos.',
          technologies: ['WordPress', 'Elementor'],
          image: require("@/assets/img/chivas.png"),
          author: {
             name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        {
          id: 7,
          title: 'El Deposito',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER AGENCY',
          description: 'Sitio institucional de distribución mayorista ferretera.',
          technologies: ['WordPress', 'Elementor'],
          image: require("@/assets/img/eldeposito.png"),
          author: {
           name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        {
          id: 8,
          title: 'Nuevo Puente',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER AGENCY',
          description: 'Web institucional para tradicional fiambrería mendocina.',
          technologies: ['WordPress', 'Elementor'],
          image: require("@/assets/img/nuevopuente.png"),
          author: {
             name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        {
          id: 9,
          title: 'REMAX',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'UNDER AGENCY',
          description: 'Sitio institucional de venta y alquiler de propiedades.',
          technologies: ['WordPress', 'Elementor'],
          image: require("@/assets/img/remax.png"),
          author: {
             name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        
        // WordPress Projects - SOULWARE
        {
          id: 10,
          title: 'Grupo Más',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Sitio institucional de proyectos inmobiliarios en Mendoza.',
          technologies: ['WordPress', 'Elementor'],
          image: require("@/assets/img/grupomas.png"),
          author: {
           name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        {
          id: 11,
          title: 'Mastroeni',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Web institucional con catálogo de vinos de bodega.',
          technologies: ['WordPress', 'Elementor'],
          image: require("@/assets/img/mastroeni.png"),
          author: {
            name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        {
          id: 12,
          title: 'Galea',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Inmobiliaria con sistema de carga y sincronización de propiedades.',
          technologies: ['WordPress', 'Elementor'],
          image: require("@/assets/img/galea.png"),
          author: {
             name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        {
          id: 13,
          title: 'Paralelo',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Sitio institucional de proyectos inmobiliarios innovadores.',
          technologies: ['WordPress', 'Elementor'],
          image: require("@/assets/img/paralelo.png"),
          author: {
             name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        {
          id: 14,
          title: 'Hot House',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Web inmobiliaria para campaña Hot Sale de Remax Solutions.',
          technologies: ['WordPress', 'Elementor'],
          image: require("@/assets/img/remax.png"),
          author: {
             name: 'UNDER Agency',
            role: 'Agencia de Marketing',
            avatar: require("@/assets/icons/underava.png"),
          }
        },
        {
          id: 15,
          title: 'Casita de Flor',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'E-commerce de arreglos florales y regalos especiales.',
          technologies: ['WordPress', 'Elementor', 'WooCommerce'],
          image: require("@/assets/img/casitadeflor.png"),
          author: {
          name: 'SOULWARE',
            role: 'Marca Personal', 
            avatar: require("@/assets/icons/soulava.png"),
          }
        },
        {
          id: 16,
          title: 'Termet SA',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Web institucional de ingeniería en refrigeración y procesos.',
          technologies: ['WordPress', 'Elementor'],
          image: require("@/assets/img/termet.png"),
          author: {
            name: 'SOULWARE',
            role: 'Marca Personal', 
            avatar: require("@/assets/icons/soulava.png"),
          }
        },
        {
          id: 17,
          title: 'Victoria SM',
          category: 'wordpress',
          categoryLabel: 'WordPress',
          agency: 'SOULWARE',
          description: 'Web de sport management y representación deportiva.',
          technologies: ['WordPress', 'Elementor'],
          image: require("@/assets/img/victoria.png"),
          author: {
           name: 'SOULWARE',
            role: 'Marca Personal', 
            avatar: require("@/assets/icons/soulava.png"),
          }
        },
        
        // FullStack Projects
        {
          id: 18,
          title: 'App de Gestión de Turnos Médicos',
          category: 'fullstack',
          categoryLabel: 'Full Stack',
          agency: 'Proyecto de estudio',
          description: 'App para agenda médica y administración de turnos.',
          technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Express'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'Fernando Alma',
            role: 'Full Stack Developer',
            avatar: require("@/assets/icons/ferava.png"),
          }
        },
        
        // Backend Projects
        {
          id: 19,
          title: 'App de Homebanking',
          category: 'backend',
          categoryLabel: 'Backend',
          agency: 'Proyecto de estudio',
          description: 'Plataforma bancaria con pagos, transferencias y consultas.',
          technologies: ['Node.js', 'Express', 'MongoDB', 'JWT'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'Fernando Alma',
            role: 'Backend Developer',
            avatar: require("@/assets/icons/ferava.png"),
          }
        },
        {
          id: 20,
          title: 'Foro Hub',
          category: 'backend',
          categoryLabel: 'Backend',
          agency: 'Proyecto de estudio',
          description: 'Foro educativo con usuarios, categorías y gestión de temas.',
          technologies: ['Java', 'Spring Boot', 'MySQL', 'JWT'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'Fernando Alma',
            role: 'Backend Developer',
            avatar: require("@/assets/icons/ferava.png"),
          }
        },
        {
          id: 21,
          title: 'LiterAlura',
          category: 'backend',
          categoryLabel: 'Backend',
          agency: 'Proyecto de estudio',
          description: 'Aplicación web para explorar y organizar libros online.',
          technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'REST'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'Fernando Alma',
            role: 'Backend Developer',
            avatar: require("@/assets/icons/ferava.png"),
          }
        },
        {
          id: 22,
          title: 'Conversor de Monedas',
          category: 'backend',
          categoryLabel: 'Backend',
          agency: 'Proyecto de estudio',
          description: 'Conversor de divisas en tiempo real con tasas actualizadas.',
          technologies: ['Python', 'FastAPI', 'APIs Externas', 'Redis'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'Fernando Alma',
            role: 'Backend Developer',
            avatar: require("@/assets/icons/ferava.png"),
          }
        },
        {
          id: 23,
          title: 'Facemask Detection',
          category: 'backend',
          categoryLabel: 'Backend',
          agency: 'Proyecto de estudio',
          description: 'App de IA para detección de uso de mascarillas.',
          technologies: ['Python', 'OpenCV', 'TensorFlow', 'Flask'],
          image: '/api/placeholder/400/300',
          author: {
            name: 'Fernando Alma',
            role: 'Backend Developer',
            avatar: require("@/assets/icons/ferava.png"),
          }
        },
        
        // Frontend Projects
        {
          id: 24,
          title: 'Amigo Secreto',
          category: 'frontend',
          categoryLabel: 'Frontend',
          agency: 'Proyecto de estudio',
          description: 'Plataforma online para organizar sorteos de amigo secreto.',
          technologies: ['HTML5', 'CSS3', 'JavaScript', 'LocalStorage'],
          image: require("@/assets/img/amigosecreto.png"),
          author: {
            name: 'Fernando Alma',
            role: 'Frontend Developer',
            avatar: require("@/assets/icons/ferava.png"),
          }
        },
        {
          id: 25,
          title: 'Pokedesk',
          category: 'frontend',
          categoryLabel: 'Frontend',
          agency: 'Proyecto de estudio',
          description: 'Aplicación interactiva con información y filtros de Pokémon.',
          technologies: ['React', 'CSS3', 'PokeAPI', 'Axios'],
          image: require("@/assets/img/poke.png"),
          author: {
              name: 'Fernando Alma',
            role: 'Frontend Developer',
            avatar: require("@/assets/icons/ferava.png"),
          }
        },
        {
          id: 26,
          title: 'Juego AVATAR',
          category: 'frontend',
          categoryLabel: 'Frontend',
          agency: 'Proyecto de estudio',
          description: 'Videojuego de aventura y combate inspirado en AVATAR.',
          technologies: ['JavaScript', 'HTML5 Canvas', 'CSS3', 'GSAP'],
          image: require("@/assets/img/amigosecreto.png"),
          author: {
              name: 'Fernando Alma',
            role: 'Game Developer',
            avatar: require("@/assets/icons/ferava.png"),
          }
        },
        {
          id: 27,
          title: 'McDonalds Replic',
          category: 'frontend',
          categoryLabel: 'Frontend',
          agency: 'Proyecto de estudio',
          description: 'Réplica web interactiva del menú digital de McDonald\'s.',
          technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
          image: require("@/assets/img/mac.png"),
          author: {
            name: 'Fernando Alma',
            role: 'Frontend Developer',
            avatar: require("@/assets/icons/ferava.png"),
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
        { key: 'all', label: 'Todos', icon: '', count: this.projects.length },
        { key: 'wordpress', label: 'WordPress', icon: '', count: wordpressCount },
        { key: 'fullstack', label: 'Full Stack', icon: '', count: fullstackCount },
        { key: 'backend', label: 'Backend', icon: '', count: backendCount },
        { key: 'frontend', label: 'Frontend', icon: '', count: frontendCount }
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
      console.log('Ver GitHub:', project.title);
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
  padding: 0.40rem 1.0rem;
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
  background: rgba(128, 5, 235, 0.082);
  transform: translateY(-2px);
}

.filter-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: rgb(43, 5, 235);
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
  background: rgb(43, 5, 235);
  color: white;
}

/* Projects Grid */
.projects-grid {
  margin-bottom: 3rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card {
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: hsla(253, 94%, 21%, 0.444);
  
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
  background: rgba(54, 7, 208, 0.778);
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
  padding: 0.25rem 1.0rem;
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
  color: rgb(54, 7, 208);
  font-weight: 800;
}

.action-btn.secondary {
  background: transparent;
  color: white;
  font-weight: 800;
}

.action-btn:hover {
  transform: translateY(-2px);
}

/* Project Content */
.project-content {
  padding: 1.9rem;

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

.agency-tag.under-agency {
  border-color: #fff36b;
  color: #f8f2dd;
  background: rgba(245, 221, 4, 0.1);
}

.agency-tag.soulware {
  border-color: #9f4df7;
  color: #ffffff;
  background: rgba(129, 88, 233, 0.484);
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
  flex-direction: row;
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

.bottom-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
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
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  /* Author Info */
.author-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.8rem;
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
    flex-direction: row;
    align-items: center;
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