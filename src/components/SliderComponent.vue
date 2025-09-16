<template>
  <div class="infinite-slider-container" :id="sliderId" ref="sliderContainer">
    <div class="slider-wrapper" ref="sliderWrapper">
      <div
        class="slider-track"
        ref="sliderTrack"
        :style="{
          transform: `translateX(${translateX}px)`,
          transition: isTransitioning ? `transform ${transitionDuration}ms ease-in-out` : 'none',
          '--slide-width': `${slideWidth}px`,
          '--slide-gap': `${slideGap}px`,
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
          :key="`${sliderId}-slide-${index}`"
          class="slide-item"
        >
          <div class="project-card">
            <div class="image-wrapper">
              <img
                :src="project.image"
                :alt="project.name"
                class="project-image"
                loading="lazy"
              />
              <span class="project-category">{{ project.category }}</span>
            </div>
            <div class="card-content">
              <h3 class="project-title">{{ project.name }}</h3>
              <p class="project-description">{{ project.description }}</p>
              <p class="project-tech">{{ project.technologies.join(", ") }}</p>
              <a v-if="project.link" :href="project.link" target="_blank" class="project-link">
                Ver sitio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Flechas de navegación - Se restauran ambas y se ajusta su posición -->
    <button
      class="nav-arrow nav-arrow-left"
      @click="goToPrevious"
      @mouseenter="pauseAutoplay"
      @mouseleave="resumeAutoplay"
      :disabled="isAnimating"
      :aria-label="`Previous ${sliderId} project`"
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
      :aria-label="`Next ${sliderId} project`"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Dots -->
    <div class="pagination-dots">
      <button
        v-for="(project, index) in projects"
        :key="`${sliderId}-dot-${index}`"
        class="dot"
        :class="{ active: index === currentRealIndex }"
        @click="goToSlide(index)"
        :aria-label="`Go to project ${index + 1}`"
      ></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SliderComponent",
  props: {
    projects: {
      type: Array,
      required: true,
    },
    sliderId: {
      type: String,
      required: true,
    },
    transitionDuration: {
      type: Number,
      default: 600, // Duración de la transición en ms
    },
    autoplayInterval: {
      type: Number,
      default: 2800, // Intervalo de autoplay en ms
    },
  },
  data() {
    return {
      currentIndex: 0, // Índice actual incluyendo clones
      currentRealIndex: 0, // Índice real del proyecto original
      translateX: 0,
      isTransitioning: false,
      isAnimating: false, // Bloquea botones/swipe durante la animación
      autoplayTimer: null,
      autoplayPaused: false,
      isVisible: true, // Para IntersectionObserver
      isDragging: false,
      dragStartX: 0,
      dragCurrentX: 0,
      slideWidth: 320, // Ancho base de un slide (se ajustará)
      slideGap: 24, // Espacio entre slides
      slidesToShow: 3, // Número de slides visibles (se ajustará)
      resizeObserver: null,
    };
  },

  computed: {
    displayProjects() {
      if (this.projects.length === 0) return [];
      // Se clona un número de slides igual a slidesToShow para un loop "suave"
      // Es importante clonar suficientes para que el salto no sea perceptible
      const clonesCount = Math.max(this.slidesToShow, 2); // Al menos 2 para tener margen
      const first = this.projects.slice(0, clonesCount);
      const last = this.projects.slice(-clonesCount);
      return [...last, ...this.projects, ...first];
    },
    totalOriginalSlides() {
      return this.projects.length;
    },
    slideMovementUnit() {
      return this.slideWidth + this.slideGap;
    },
  },

  watch: {
    projects: {
      handler() {
        this.setupResponsiveness(); // Recalcular layout si cambian los proyectos
        this.initSlider();
      },
      deep: true,
    },
  },

  mounted() {
    this.setupResponsiveness();
    this.initSlider();
    this.setupIntersectionObserver();
    this.startAutoplay();
    this.preloadImages();
  },

  beforeUnmount() {
    this.cleanup();
  },

  methods: {
    initSlider() {
      this.$nextTick(() => {
        if (this.totalOriginalSlides === 0) return;
        this.currentIndex = Math.max(this.slidesToShow, 2); // Posiciona en el primer slide real después de los clones
        this.currentRealIndex = 0;
        this.updatePosition(false); // Sin animación inicial
      });
    },

    updatePosition(animate = true) {
      this.isTransitioning = animate;
      this.translateX = -(this.currentIndex * this.slideMovementUnit);
    },

    goToNext() {
      if (this.isAnimating || this.totalOriginalSlides === 0) return;

      this.isAnimating = true;
      this.currentIndex++;
      this.currentRealIndex = (this.currentRealIndex + 1) % this.totalOriginalSlides;

      this.updatePosition(true);

      setTimeout(() => {
        // Si hemos llegado a un clon al final, saltamos al equivalente real sin transición
        if (this.currentIndex >= this.totalOriginalSlides + Math.max(this.slidesToShow, 2)) {
          this.currentIndex = Math.max(this.slidesToShow, 2); // Salta al inicio de los slides reales
          this.updatePosition(false); // Salto instantáneo
        }
        this.isAnimating = false;
        // Solo desactiva la transición si no se va a hacer un salto instantáneo
        if (this.isTransitioning) {
            this.isTransitioning = false;
        }
      }, this.transitionDuration);
      this.preloadImages();
    },

    goToPrevious() {
      if (this.isAnimating || this.totalOriginalSlides === 0) return;

      this.isAnimating = true;
      this.currentIndex--;
      this.currentRealIndex = this.currentRealIndex === 0
        ? this.totalOriginalSlides - 1
        : this.currentRealIndex - 1;

      this.updatePosition(true);

      setTimeout(() => {
        // Si hemos llegado a un clon al principio, saltamos al equivalente real sin transición
        if (this.currentIndex < Math.max(this.slidesToShow, 2)) {
          this.currentIndex = this.totalOriginalSlides + Math.max(this.slidesToShow, 2) - 1; // Salta al final de los slides reales
          this.updatePosition(false); // Salto instantáneo
        }
        this.isAnimating = false;
         // Solo desactiva la transición si no se va a hacer un salto instantáneo
        if (this.isTransitioning) {
            this.isTransitioning = false;
        }
      }, this.transitionDuration);
      this.preloadImages();
    },

    goToSlide(index) {
      if (this.isAnimating || index === this.currentRealIndex || this.totalOriginalSlides === 0) return;

      this.isAnimating = true;
      this.currentRealIndex = index;
      this.currentIndex = index + Math.max(this.slidesToShow, 2); // Ajustar por los clones iniciales

      this.updatePosition(true);

      setTimeout(() => {
        this.isAnimating = false;
        this.isTransitioning = false;
      }, this.transitionDuration);
      this.preloadImages();
    },

    // AUTOPLAY
    startAutoplay() {
      this.stopAutoplay();
      // Solo iniciar autoplay si hay más slides que los que se muestran y no está pausado
      if (this.isVisible && !this.autoplayPaused && this.totalOriginalSlides > this.slidesToShow) {
        this.autoplayTimer = setInterval(() => {
          if (!this.isDragging && !this.isAnimating && this.isVisible && !this.autoplayPaused) {
            this.goToNext();
          }
        }, this.autoplayInterval);
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
      // Pequeña espera para evitar reanudar inmediatamente si se movió el mouse sobre las flechas
      setTimeout(() => {
        if (!this.autoplayPaused) {
          this.startAutoplay();
        }
      }, 500); // Reduce el tiempo de espera
    },

    // INTERSECTION OBSERVER para autoplay al estar visible
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
        }, { threshold: 0.5 }); // Cuando el 50% del componente es visible
        this.observer.observe(this.$refs.sliderContainer);
      }
    },

    // DRAG GESTURES (TOUCH & MOUSE)
    startDrag(clientX) {
      if (this.isAnimating || this.totalOriginalSlides === 0) return;
      this.isDragging = true;
      this.dragStartX = clientX;
      this.dragCurrentX = clientX;
      this.isTransitioning = false; // Deshabilitar transición durante el arrastre
      this.pauseAutoplay();
    },

    updateDrag(clientX) {
      if (!this.isDragging) return;
      this.dragCurrentX = clientX;
      const diff = this.dragCurrentX - this.dragStartX;
      const currentOffset = -(this.currentIndex * this.slideMovementUnit);
      this.translateX = currentOffset + diff;
    },

    endDrag() {
      if (!this.isDragging) return;
      this.isDragging = false;

      const diff = this.dragCurrentX - this.dragStartX;
      const threshold = this.slideWidth * 0.3; // Umbral para considerar un swipe

      if (Math.abs(diff) > threshold) {
        if (diff > 0) { // Swipe a la derecha (anterior)
          this.goToPrevious();
        } else { // Swipe a la izquierda (siguiente)
          this.goToNext();
        }
      } else {
        // No hubo swipe significativo, volver a la posición actual
        this.updatePosition(true);
      }
      this.resumeAutoplay();
    },

    handleTouchStart(e) { this.startDrag(e.touches[0].clientX); },
    handleTouchMove(e) { if (this.isDragging) { e.preventDefault(); this.updateDrag(e.touches[0].clientX); } },
    handleTouchEnd() { this.endDrag(); },
    handleMouseDown(e) { this.startDrag(e.clientX); },
    handleMouseMove(e) { if (this.isDragging) { this.updateDrag(e.clientX); } },
    handleMouseUp() { this.endDrag(); },
    handleMouseLeave() { if (this.isDragging) this.endDrag(); },

    // IMAGE PRELOADING
    preloadImages() {
      if (this.totalOriginalSlides === 0) return;
      // Precarga el siguiente y el anterior slide real
      const nextIndex = (this.currentRealIndex + 1) % this.totalOriginalSlides;
      const prevIndex = this.currentRealIndex === 0 ? this.totalOriginalSlides - 1 : this.currentRealIndex - 1;

      [nextIndex, prevIndex].forEach(index => {
        if (this.projects[index] && this.projects[index].image) {
          const img = new Image();
          img.src = this.projects[index].image;
        }
      });
    },

    // Manejo de responsividad y cálculo de slides visibles
    setupResponsiveness() {
      if (this.$refs.sliderContainer && 'ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(entries => {
          for (let entry of entries) {
            if (entry.target === this.$refs.sliderContainer) {
              this.calculateSliderLayout(entry.contentRect.width);
              this.updatePosition(false); // Recalcular posición sin animación
            }
          }
        });
        this.resizeObserver.observe(this.$refs.sliderContainer);
      } else {
        // Fallback para navegadores sin ResizeObserver
        window.addEventListener('resize', this.handleWindowResize);
        this.handleWindowResize();
      }
    },

    handleWindowResize() {
      this.$nextTick(() => {
        if (this.$refs.sliderContainer) {
          this.calculateSliderLayout(this.$refs.sliderContainer.clientWidth);
          this.updatePosition(false);
        }
      });
    },

    calculateSliderLayout(containerWidth) {
      // Ajuste del padding horizontal del contenedor para flechas
      // Este padding permite que las flechas queden fuera del área de slides
      const containerPadding = parseFloat(getComputedStyle(this.$refs.sliderContainer).paddingLeft) * 2;
      const availableWidth = containerWidth - containerPadding;

      if (availableWidth <= 480) { // Móviles
        this.slidesToShow = 1;
        this.slideGap = 16;
        this.slideWidth = availableWidth - (this.slideGap * 2); // Un slide completo con margen a los lados
      } else if (availableWidth <= 768) { // Tablets
        this.slidesToShow = 2;
        this.slideGap = 20;
        this.slideWidth = (availableWidth - (this.slideGap * (this.slidesToShow - 1))) / this.slidesToShow;
      } else if (availableWidth <= 1024) { // Laptops pequeñas
        this.slidesToShow = 3;
        this.slideGap = 24;
        this.slideWidth = (availableWidth - (this.slideGap * (this.slidesToShow - 1))) / this.slidesToShow;
      } else { // Escritorio
        this.slidesToShow = 3;
        this.slideGap = 24;
        // Calcula el ancho del slide para que los 3 slides quepan perfectamente
        // Si 320px * 3 + 24px * 2 > availableWidth, entonces ajusta
        const idealTotalWidth = (320 * 3) + (24 * 2);
        if (idealTotalWidth > availableWidth && availableWidth > 0) {
            this.slideWidth = (availableWidth - (this.slideGap * (this.slidesToShow - 1))) / this.slidesToShow;
        } else {
            this.slideWidth = 320;
        }
      }

      // Asegúrate de que el ancho mínimo del slide no sea demasiado pequeño
      this.slideWidth = Math.max(200, this.slideWidth);
    },

    cleanup() {
      this.stopAutoplay();
      if (this.observer) {
        this.observer.disconnect();
      }
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      window.removeEventListener('resize', this.handleWindowResize);
    },
  },
};
</script>

<style scoped>

.infinite-slider-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  /* El padding ahora es crucial para que las flechas se posicionen bien fuera del slider-wrapper */
  padding: 0 50px; /* Suficiente espacio para que las flechas no desborden */
  box-sizing: border-box; /* Asegura que el padding se incluye en el width */
}

.slider-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden; /* Esto es importante para recortar los slides extra */
  border-radius: 16px;
  cursor: grab;
}

.slider-wrapper:active {
  cursor: grabbing;
}

.slider-track {
  display: flex;
  gap: var(--slide-gap); /* Usamos la variable CSS para el gap */
  will-change: transform;
  user-select: none;
}

.slide-item {
  flex-shrink: 0;
  width: var(--slide-width); /* Usamos la variable CSS para el ancho */
  height: 400px; /* Alto fijo o considera hacerlo dinámico también */
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
  z-index: 100; /* Asegura que esté por encima de los slides */
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
  left: 10px; /* Ajusta la posición de la flecha izquierda */
}

.nav-arrow-right {
  right: 10px; /* Ajusta la posición de la flecha derecha */
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
    padding: 0 40px; /* Menos padding en pantallas medianas */
  }

  .nav-arrow {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 768px) {
  .infinite-slider-container {
    padding: 0 30px; /* Más cerca de los bordes en tablets */
  }

  .nav-arrow {
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 480px) {
  .infinite-slider-container {
    padding: 0 20px; /* Mínimo padding para móviles */
  }

  .nav-arrow {
    width: 40px;
    height: 40px;
    /* Las flechas en móviles se pueden posicionar más al borde o incluso ocultar si el espacio es muy limitado */
    /* Para este caso, las dejamos cerca del borde */
  }

  .nav-arrow-left {
    left: 5px;
  }
  .nav-arrow-right {
    right: 5px;
  }
}
</style>