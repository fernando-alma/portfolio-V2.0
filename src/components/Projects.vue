<template>
  <!-- Primer slider - Proyectos profesionales -->
  <h1 id="experiencia">Algunos de mis proyectos profesionales</h1>
  <div class="infinite-slider-container" ref="sliderContainer">
    <div class="slider-wrapper" ref="sliderWrapper">
      <div 
        class="slider-track" 
        ref="sliderTrack"
        :style="{ 
          transform: `translateX(${translateX}px)`, 
          transition: isTransitioning ? `transform ${transitionDuration}ms ease-in-out` : 'none' 
        }"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
      >
        <div 
          v-for="(project, index) in displayProjects" 
          :key="`slide-${index}`"
          class="slide-item"
        >
          <div class="project-card">
            <div class="image-wrapper">
              <img 
                :src="project.image" 
                :alt="project.name" 
                class="project-image"
                loading="lazy"
                @load="handleImageLoad"
              />
              <span class="project-category">{{ project.category }}</span>
            </div>
            <div class="card-content">
              <h3 class="project-title">{{ project.name }}</h3>
              <p class="project-description">{{ project.description }}</p>
              <p class="project-tech">{{ project.technologies.join(', ') }}</p>
              <a v-if="project.link" :href="project.link" target="_blank" class="project-link">
                Ver sitio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Flechas fuera del slider -->
    <button 
      class="nav-arrow nav-arrow-left" 
      @click="goToPrevious" 
      @mouseenter="pauseAutoplay"
      @mouseleave="resumeAutoplay"
      :disabled="isAnimating"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    
    <button 
      class="nav-arrow nav-arrow-right" 
      @click="goToNext" 
      @mouseenter="pauseAutoplay"
      @mouseleave="resumeAutoplay"
      :disabled="isAnimating"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Dots -->
    <div class="pagination-dots">
      <button 
        v-for="(project, index) in originalProjects" 
        :key="index"
        class="dot"
        :class="{ active: index === currentRealIndex }"
        @click="goToSlide(index)"
      ></button>
    </div>
  </div>
  
  <!-- Segundo slider - Proyectos de estudio -->
  <h1 class="study-projects-title">Algunos de mis proyectos de estudio</h1>
  <div class="infinite-slider-container" ref="sliderContainer2">
    <div class="slider-wrapper" ref="sliderWrapper2">
      <div 
        class="slider-track" 
        ref="sliderTrack2"
        :style="{ 
          transform: `translateX(${translateX2}px)`, 
          transition: isTransitioning2 ? `transform ${transitionDuration}ms ease-in-out` : 'none' 
        }"
        @touchstart="handleTouchStart2"
        @touchmove="handleTouchMove2"
        @touchend="handleTouchEnd2"
        @mousedown="handleMouseDown2"
        @mousemove="handleMouseMove2"
        @mouseup="handleMouseUp2"
        @mouseleave="handleMouseUp2"
      >
        <div 
          v-for="(project, index) in displayStudyProjects" 
          :key="`study-slide-${index}`"
          class="slide-item"
        >
          <div class="project-card">
            <div class="image-wrapper">
              <img 
                :src="project.image" 
                :alt="project.name" 
                class="project-image"
                loading="lazy"
                @load="handleImageLoad"
              />
              <span class="project-category">{{ project.category }}</span>
            </div>
            <div class="card-content">
              <h3 class="project-title">{{ project.name }}</h3>
              <p class="project-description">{{ project.description }}</p>
              <p class="project-tech">{{ project.technologies.join(', ') }}</p>
              <a v-if="project.link" :href="project.link" target="_blank" class="project-link">
                Ver proyecto
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Flechas para el segundo slider -->
    <button 
      class="nav-arrow nav-arrow-left" 
      @click="goToPrevious2" 
      @mouseenter="pauseAutoplay2"
      @mouseleave="resumeAutoplay2"
      :disabled="isAnimating2"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    
    <button 
      class="nav-arrow nav-arrow-right" 
      @click="goToNext2" 
      @mouseenter="pauseAutoplay2"
      @mouseleave="resumeAutoplay2"
      :disabled="isAnimating2"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Dots para el segundo slider -->
    <div class="pagination-dots">
      <button 
        v-for="(project, index) in studyProjects" 
        :key="index"
        class="dot"
        :class="{ active: index === currentRealIndex2 }"
        @click="goToSlide2(index)"
      ></button>
    </div>
  </div>
  <!-- Botón para ver todos -->
    <div class="view-all-section">
      <router-link to="/portfolio-completo" class="btn-view-all">
         Ver Portfolio Completo
      </router-link>
    </div>
</template>

<script>
export default {
  name: "InfiniteSlider",
  data() {
    return {
      currentIndex: 0,
      currentRealIndex: 0,
      translateX: 0,
      isTransitioning: false,
      isAnimating: false,
      transitionDuration: 600,
      slideWidth: 320,
      slideGap: 24,
      
      // Autoplay
      autoplayTimer: null,
      autoplayPaused: false,
      isVisible: true,
      
      // Drag
      isDragging: false,
      dragStartX: 0,
      dragCurrentX: 0,
      
      // Intersection Observer
      observer: null,
      
      originalProjects: [
        { 
          id: 1,
          name: "Herbo", 
          description: "Ecommerce para venta de baterías de autos y motos.", 
          link: "https://herbomendoza.com.ar/",
          image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
          category: "Ecommerce",
          technologies: ["Vue.js", "CSS", "HTML"]
        },
        { 
          id: 2,
          name: "Franchi", 
          description: "Sistema interno de carga de propiedades inmobiliarias con integración API.", 
          link: "https://inmobiliariafranchi.com/",
          image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
          category: "Sistema Web",
          technologies: ["Vue.js", "API", "JavaScript"]
        },
        { 
          id: 3,
          name: "Durox", 
          description: "Sitio institucional de insumos para bodegas y enología.", 
          link: "https://sitioseis.soulware.com.ar/",
          image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=250&fit=crop",
          category: "Web Institucional",
          technologies: ["Vue.js", "CSS", "HTML"]
        },
        { 
          id: 4,
          name: "DSG", 
          description: "Web corporativa para empresarios expertos en finanzas de México.", 
          link: "https://sitiotres.soulware.com.ar/",
          image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop",
          category: "Corporativa",
          technologies: ["Vue.js", "CSS", "JavaScript"]
        },
        { 
          id: 5,
          name: "XOXO", 
          description: "Sitio para discoteca en México con sistema de menú digital.", 
          link: "https://sitiouno.soulware.com.ar/",
          image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=250&fit=crop",
          category: "Entretenimiento",
          technologies: ["Vue.js", "HTML", "CSS"]
        },
        { 
          id: 6,
          name: "Chivas", 
          description: "Servicios integrales para la industria del petróleo, gas y minería.", 
          link: "https://servicioschivas.com.ar/",
          image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=400&h=250&fit=crop",
          category: "Industrial",
          technologies: ["Vue.js", "API", "JavaScript"]
        }
      ],

      // Variables para el segundo slider
      currentIndex2: 0,
      currentRealIndex2: 0,
      translateX2: 0,
      isTransitioning2: false,
      isAnimating2: false,
      autoplayTimer2: null,
      autoplayPaused2: false,
      isDragging2: false,
      dragStartX2: 0,
      dragCurrentX2: 0,
      
      // Proyectos de estudio
      studyProjects: [
        { 
          id: 1,
          name: "Portfolio Personal", 
          description: "Portfolio desarrollado con Vue.js y animaciones CSS", 
          link: "https://github.com/tuuser/portfolio",
          image: "/img/portfolio.jpg",
          category: "Frontend",
          technologies: ["Vue.js", "CSS", "HTML"]
        },
        { 
          id: 2,
          name: "Weather App", 
          description: "Aplicación del clima con API de OpenWeather", 
          link: "https://github.com/tuuser/weather-app",
          image: "/img/weather.jpg",
          category: "Frontend",
          technologies: ["Vue.js", "API", "JavaScript"]
        },
        { 
          id: 3,
          name: "Task Manager", 
          description: "Aplicación de gestión de tareas con Vue y Firebase", 
          link: "https://github.com/tuuser/task-manager",
          image: "/img/tasks.jpg",
          category: "Fullstack",
          technologies: ["Vue.js", "Firebase", "CSS"]
        }
        // Agregar más proyectos según necesitemos
      ]
    };
  },
  
  computed: {
    displayProjects() {
      // Crear loop infinito: [últimos] + [originales] + [primeros]
      const first = this.originalProjects.slice(0, 2);
      const last = this.originalProjects.slice(-2);
      return [...last, ...this.originalProjects, ...first];
    },
    
    totalSlides() {
      return this.originalProjects.length;
    },
    
    displayStudyProjects() {
      const first = this.studyProjects.slice(0, 2);
      const last = this.studyProjects.slice(-2);
      return [...last, ...this.studyProjects, ...first];
    },
  },
  
  mounted() {
    this.initSlider();
    this.setupIntersectionObserver();
    this.startAutoplay();
    this.preloadImages();
    
    window.addEventListener('resize', this.handleResize);
    this.initSlider2();
    this.startAutoplay2();
  },
  
  beforeUnmount() {
    this.cleanup();
  },
  
  methods: {
    initSlider() {
      this.$nextTick(() => {
        // Posicionar en el primer slide real (después de los clones)
        this.currentIndex = 2; // Posición de los slides reales
        this.currentRealIndex = 0;
        this.updatePosition(false); // Sin animación inicial
      });
    },
    
    updatePosition(animate = true) {
      this.isTransitioning = animate;
      this.translateX = -(this.currentIndex * (this.slideWidth + this.slideGap));
    },
    
    goToNext() {
      if (this.isAnimating) return;
      
      this.isAnimating = true;
      this.currentIndex++;
      this.currentRealIndex = (this.currentRealIndex + 1) % this.totalSlides;
      
      this.updatePosition(true);
      this.preloadImages();
      
      // Verificar si necesitamos saltar al inicio
      setTimeout(() => {
        if (this.currentIndex >= this.totalSlides + 2) {
          this.currentIndex = 2;
          this.updatePosition(false);
        }
        this.isAnimating = false;
        this.isTransitioning = false;
      }, this.transitionDuration);
    },
    
    goToPrevious() {
      if (this.isAnimating) return;
      
      this.isAnimating = true;
      this.currentIndex--;
      this.currentRealIndex = this.currentRealIndex === 0 ? this.totalSlides - 1 : this.currentRealIndex - 1;
      
      this.updatePosition(true);
      
      // Verificar si necesitamos saltar al final
      setTimeout(() => {
        if (this.currentIndex < 2) {
          this.currentIndex = this.totalSlides + 1;
          this.updatePosition(false);
        }
        this.isAnimating = false;
        this.isTransitioning = false;
      }, this.transitionDuration);
    },
    
    goToSlide(index) {
      if (this.isAnimating || index === this.currentRealIndex) return;
      
      this.isAnimating = true;
      this.currentRealIndex = index;
      this.currentIndex = index + 2; // Ajustar por los clones
      
      this.updatePosition(true);
      this.preloadImages();
      
      setTimeout(() => {
        this.isAnimating = false;
        this.isTransitioning = false;
      }, this.transitionDuration);
    },
    
    // AUTOPLAY
    startAutoplay() {
      this.stopAutoplay();
      if (this.isVisible && !this.autoplayPaused) {
        this.autoplayTimer = setInterval(() => {
          if (!this.isDragging && !this.isAnimating && this.isVisible && !this.autoplayPaused) {
            this.goToNext();
          }
        }, 3000);
      }
    },
    
    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    },
    
    pauseAutoplay() {
      this.autoplayPaused = true;
      this.stopAutoplay();
    },
    
    resumeAutoplay() {
      this.autoplayPaused = false;
      setTimeout(() => {
        if (!this.autoplayPaused) {
          this.startAutoplay();
        }
      }, 1000);
    },
    
    // INTERSECTION OBSERVER
    setupIntersectionObserver() {
      if ('IntersectionObserver' in window && this.$refs.sliderContainer) {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            this.isVisible = entry.isIntersecting;
            if (entry.isIntersecting) {
              this.startAutoplay();
            } else {
              this.stopAutoplay();
            }
          });
        }, { threshold: 0.5 });
        
        this.observer.observe(this.$refs.sliderContainer);
      }
    },
    
    // TOUCH GESTURES
    handleTouchStart(e) {
      this.startDrag(e.touches[0].clientX);
    },
    
    handleTouchMove(e) {
      if (this.isDragging) {
        e.preventDefault();
        this.updateDrag(e.touches[0].clientX);
      }
    },
    
    handleTouchEnd() {
      this.endDrag();
    },
    
    handleMouseDown(e) {
      this.startDrag(e.clientX);
    },
    
    handleMouseMove(e) {
      if (this.isDragging) {
        this.updateDrag(e.clientX);
      }
    },
    
    handleMouseUp() {
      this.endDrag();
    },
    
    startDrag(clientX) {
      this.isDragging = true;
      this.dragStartX = clientX;
      this.dragCurrentX = clientX;
      this.pauseAutoplay();
    },
    
    updateDrag(clientX) {
      if (!this.isDragging) return;
      
      this.dragCurrentX = clientX;
      const diff = this.dragCurrentX - this.dragStartX;
      const baseTranslate = -(this.currentIndex * (this.slideWidth + this.slideGap));
      this.translateX = baseTranslate + diff;
    },
    
    endDrag() {
      if (!this.isDragging) return;
      
      const diff = this.dragCurrentX - this.dragStartX;
      const threshold = this.slideWidth * 0.3;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.goToPrevious();
        } else {
          this.goToNext();
        }
      } else {
        this.updatePosition(true);
        setTimeout(() => {
          this.isTransitioning = false;
        }, this.transitionDuration);
      }
      
      this.isDragging = false;
      this.resumeAutoplay();
    },
    
    // IMAGE PRELOADING
    preloadImages() {
      const nextIndex = (this.currentRealIndex + 1) % this.totalSlides;
      const prevIndex = this.currentRealIndex === 0 ? this.totalSlides - 1 : this.currentRealIndex - 1;
      
      [nextIndex, prevIndex].forEach(index => {
        const img = new Image();
        img.src = this.originalProjects[index].image;
      });
    },
    
    handleImageLoad() {
      // Imagen cargada
    },
    
    handleResize() {
      this.updatePosition(false);
    },
    
    cleanup() {
      this.stopAutoplay();
      if (this.observer) {
        this.observer.disconnect();
      }
      window.removeEventListener('resize', this.handleResize);
    },
    
    // Métodos para el segundo slider (duplicar los métodos existentes agregando "2")
    initSlider2() {
      this.$nextTick(() => {
        this.currentIndex2 = 2;
        this.currentRealIndex2 = 0;
        this.updatePosition2(false);
      });
    },
    
    updatePosition2(animate = true) {
      this.isTransitioning2 = animate;
      this.translateX2 = -(this.currentIndex2 * (this.slideWidth + this.slideGap));
    },
    
    goToNext2() {
      if (this.isAnimating2) return;
      
      this.isAnimating2 = true;
      this.currentIndex2++;
      this.currentRealIndex2 = (this.currentRealIndex2 + 1) % this.studyProjects.length;
      
      this.updatePosition2(true);
      
      setTimeout(() => {
        if (this.currentIndex2 >= this.studyProjects.length + 2) {
          this.currentIndex2 = 2;
          this.updatePosition2(false);
        }
        this.isAnimating2 = false;
        this.isTransitioning2 = false;
      }, this.transitionDuration);
    },
    
    goToPrevious2() {
      if (this.isAnimating2) return;
      
      this.isAnimating2 = true;
      this.currentIndex2--;
      this.currentRealIndex2 = this.currentRealIndex2 === 0 ? this.studyProjects.length - 1 : this.currentRealIndex2 - 1;
      
      this.updatePosition2(true);
      
      setTimeout(() => {
        if (this.currentIndex2 < 2) {
          this.currentIndex2 = this.studyProjects.length + 1;
          this.updatePosition2(false);
        }
        this.isAnimating2 = false;
        this.isTransitioning2 = false;
      }, this.transitionDuration);
    },
    
    goToSlide2(index) {
      if (this.isAnimating2 || index === this.currentRealIndex2) return;
      
      this.isAnimating2 = true;
      this.currentRealIndex2 = index;
      this.currentIndex2 = index + 2; // Ajustar por los clones
      
      this.updatePosition2(true);
      this.preloadImages();
      
      setTimeout(() => {
        this.isAnimating2 = false;
        this.isTransitioning2 = false;
      }, this.transitionDuration);
    },
    
    // AUTOPLAY
    startAutoplay2() {
      this.stopAutoplay2();
      if (this.isVisible && !this.autoplayPaused2) {
        this.autoplayTimer2 = setInterval(() => {
          if (!this.isDragging2 && !this.isAnimating2 && this.isVisible && !this.autoplayPaused2) {
            this.goToNext2();
          }
        }, 3000);
      }
    },
    
    stopAutoplay2() {
      if (this.autoplayTimer2) {
        clearInterval(this.autoplayTimer2);
        this.autoplayTimer2 = null;
      }
    },
    
    pauseAutoplay2() {
      this.autoplayPaused2 = true;
      this.stopAutoplay2();
    },
    
    resumeAutoplay2() {
      this.autoplayPaused2 = false;
      setTimeout(() => {
        if (!this.autoplayPaused2) {
          this.startAutoplay2();
        }
      }, 1000);
    },
  }
};
</script>

<style scoped>
.infinite-slider-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 4rem 3rem;
  overflow: visible;
}

.slider-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 16px;
  cursor: grab;
}

.slider-wrapper:active {
  cursor: grabbing;
}

.slider-track {
  display: flex;
  gap: 24px;
  will-change: transform;
  user-select: none;
}

.slide-item {
  flex-shrink: 0;
  width: 320px;
  height: 400px;
}

.project-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 1px 4px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.08);
}

.image-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card:hover .project-image {
  transform: scale(1.1);
}

.project-category {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.card-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  color: #1a202c;
  line-height: 1.3;
}

.project-description {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #4a5568;
  margin-bottom: 1rem;
  flex: 1;
}

.project-tech {
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 1rem;
  font-weight: 500;
}

.project-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.project-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* FLECHAS EXTERNAS CON Z-INDEX ALTO */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  border: none;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(15px);
  color: #4a5568;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.nav-arrow:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-50%) scale(1.15);
  color: #667eea;
  box-shadow: 
    0 12px 35px rgba(102, 126, 234, 0.25),
    0 6px 15px rgba(0, 0, 0, 0.1);
}

.nav-arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-arrow-left {
  left: -28px;
}

.nav-arrow-right {
  right: -28px;
}

.pagination-dots {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 2rem;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: none;
  background: rgba(102, 126, 234, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dot.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scale(1.3);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.dot:hover {
  background: rgba(102, 126, 234, 0.6);
  transform: scale(1.1);
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .infinite-slider-container {
    padding: 1.5rem 3rem 2.5rem;
  }
  
  .slide-item {
    width: 280px;
  }
  
  .nav-arrow {
    width: 48px;
    height: 48px;
  }
  
  .nav-arrow-left {
    left: -24px;
  }
  
  .nav-arrow-right {
    right: -24px;
  }
}

@media (max-width: 768px) {
  .infinite-slider-container {
    padding: 1rem 2.5rem 2rem;
  }
  
  .slider-track {
    gap: 16px;
  }
  
  .slide-item {
    width: 250px;
  }
  
  .nav-arrow {
    width: 44px;
    height: 44px;
  }
  
  .nav-arrow-left {
    left: -22px;
  }
  
  .nav-arrow-right {
    right: -22px;
  }
}

@media (max-width: 480px) {
  .infinite-slider-container {
    padding: 1rem 2rem 2rem;
  }
  
  .slide-item {
    width: 280px;
  }
  
  .nav-arrow {
    width: 40px;
    height: 40px;
  }
  
  .nav-arrow-left {
    left: -20px;
  }
  
  .nav-arrow-right {
    right: -20px;
  }
}

.study-projects-title {
  margin-top: 4rem;
  color: #ffffff;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}
</style>