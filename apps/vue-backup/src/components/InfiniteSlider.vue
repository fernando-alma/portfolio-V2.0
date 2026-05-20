<template>
  <div class="sliders-section">
    <div class="sliders-content-wrapper"> <!-- CONTENEDOR INTERNO PARA EL CONTENIDO -->
      <!-- Primer slider - Proyectos profesionales -->
      <h1 class="section-title">Algunos de mis proyectos profesionales</h1>
      <h3 class="section-description">Proyectos profesionales realizados bajo mi marca personal Soulware y en colaboración con la agencia de marketing digital Under Agency.</h3>
      <SliderComponent :projects="professionalProjects" slider-id="professional" />

      <!-- Segundo slider - Proyectos de estudio -->
      <h1 class="section-title">Algunos de mis proyectos de estudio</h1>
      <h3 class="section-description">Proyectos académicos desarrollados con fines de aprendizaje y perfeccionamiento de habilidades técnicas.</h3>
      <SliderComponent :projects="studyProjects" slider-id="study" />

      <!-- Botón para ver todos -->
      <div class="view-all-section">
        <router-link to="/portfolio-completo" class="portfolio-btn">
          Ver portfolio completo
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import SliderComponent from "./SliderComponent.vue"; 

export default {
  name: "InfiniteSlidersSection",
  components: {
    SliderComponent,
  },
  data() {
    return {
      professionalProjects: [
        {
          id: 1,
          name: "Casita de Flor",
          description: "E-commerce de arreglos florales y regalos especiales para una tienda en USA.",
          link: "https://casitadeflor.com/",
          image: require("@/assets/img/casitadeflor.png"),
          category: "Ecommerce",
          technologies: ["Wordpress", "Elementor", "Woocommerce"],
        },
        {
          id: 2,
          name: "Termet SA",
          description:
            "Web institucional de ingeniería en refrigeración y procesos.",
          link: "https://termetsa.com.ar/",
          image: require("@/assets/img/termet.png"),
          category: "Web Institucional",
          technologies: ["Wordpress", "Elementor"],
        },
        {
          id: 3,
          name: "XOXO Club",
          description: "Sitio para discoteca en México con sistema de menú digital.",
          link: "https://sitiouno.soulware.com.ar/",
          image: require("@/assets/img/xoxo.png"),
          category: "Entretenimiento",
          technologies: ["Wordpress", "Elementor", "JetEngine"],
        },
        {
          id: 4,
          name: "Victoria Sports Management",
          description:
            "Web de sport management y representación deportiva.",
          link: "https://victoriasm.com.ar/",
          image: require("@/assets/img/victoria.png"),
          category: "Corporativa",
          technologies: ["Wordpress", "Elementor"],
        },
        {
          id: 5,
          name: "Durox",
          description: "Sitio institucional de insumos para bodegas y enología.",
          link: "https://sitioseis.soulware.com.ar/",
          image: require("@/assets/img/durox.png"),
          category: "Web Institucional",
          technologies: ["Wordpress", "Elementor"],
        },
        {
          id: 6,
          name: "Chivas",
          description:
            "Servicios integrales para la industria del petróleo, gas y minería.",
          link: "https://servicioschivas.com.ar/",
          image: require("@/assets/img/chivas.png"),
          category: "Web Institucional",
          technologies: ["Wordpress", "Elementor"],
        },
      ],
      studyProjects: [
        {
          id: 1,
          name: "Portfolio Personal",
          description: "Portfolio desarrollado con Vue.js y animaciones CSS",
          link: "https://github.com/tuuser/portfolio",
          image: require("@/assets/img/portfolio.png"),
          category: "Frontend",
          technologies: ["Vue.js", "CSS", "HTML"],
        },
        {
          id: 2,
          name: "App Gestión de Turnos Médicos",
          description: "App para agenda médica y administración de turnos.",
          link: "https://github.com/tuuser/weather-app",
          image: "/img/weather.jpg",
          category: "Frontend",
          technologies: ["Vue.js", "API", "JavaScript"],
        },
        {
          id: 3,
          name: "Facemask Detection",
          description:
            "App de IA para detección de uso correcto de mascarillas.",
          link: "https://github.com/tuuser/task-manager",
          image: "/img/tasks.jpg",
          category: "Fullstack",
          technologies: ["Vue.js", "Firebase", "CSS"],
        },
      ],
    };
  },
};
</script>

<style scoped>
.sliders-section {
  background-color: #2754ff;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
  overflow: hidden;
  
  z-index: 1; /* asegura que el contenido quede arriba */

}



.sliders-content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  box-sizing: border-box;
}

.section-title {
  margin-top: 4rem;
  color: #ffffff;
  font-family: "Montserrat", sans-serif;
  font-size: clamp(1.4rem, 2.7vw, 2rem);
  text-align: center;
  margin-bottom: 1.5rem; /* Ajustado para dar espacio entre título y descripción */
  background-color: #ffffff;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
}
.section-description {
  text-align: center;
  font-family: "Montserrat", sans-serif;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 2.5rem; /* Ajustado para dar espacio antes del slider */
}

.view-all-section {
  text-align: center;
  margin-top: 3rem;
}

.portfolio-btn {
  display: inline-block;
  padding: 12px 24px;
  background-color: #14095b;
  color: white;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  width: fit-content;
  min-width: 200px;
  margin-bottom: 2.5rem;
  font-family: "Montserrat", sans-serif;
  font-size: 1.2rem;
}

.portfolio-btn:hover {
  background-color: white;
  color: #14095b;
  transform: translateY(-3px);
  
}

@media (max-width: 768px) {
  .sliders-section {
    min-height: auto;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    display: block;
  }

  .sliders-content-wrapper {
    max-width: 100vw;
    padding: 0 0.5rem;
    margin: 0;
    box-sizing: border-box;
  }

  .section-title {
    font-size: 1.2rem;
    margin-top: 3rem;
    margin-bottom: 1rem;
  }

  .section-description {
    font-size: 0.95rem;
    margin-bottom: 2rem;
  }

  .view-all-section {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  .portfolio-btn {
    min-width: 140px;
    font-size: 1rem;
    padding: 10px 16px;
    margin-bottom: 1.5rem;
  }
}
</style>