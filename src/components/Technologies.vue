<template>
  <section class="technologies-section">
    <h2 id="tecno">Mis Herramientas y Tecnologías</h2>

    <!-- Slider 1: Lenguajes y Backend -->
    <div class="slider-container">
      <div 
        class="slider-track" 
        id="track1"
        :style="{ 
          '--item-count': techRow1.length,
          'animation-duration': (techRow1.length * 2.5) + 's'  /* <-- CAMBIO CLAVE AQUI */
        }"
      >
        <!-- Bloque original -->
        <div class="tech-item" v-for="tech in techRow1" :key="tech.name">
          <img :src="tech.logoUrl" :alt="tech.name" />
          <p>{{ tech.name }}</p>
        </div>
        <!-- Bloque duplicado para el efecto infinito -->
        <div class="tech-item" v-for="tech in techRow1" :key="tech.name + '-clone'" aria-hidden="true">
          <img :src="tech.logoUrl" :alt="tech.name" />
          <p>{{ tech.name }}</p>
        </div>
      </div>
    </div>

    <!-- Slider 2: Frontend, BBDD y Herramientas -->
    <div class="slider-container">
      <div 
        class="slider-track" 
        id="track2"
        :style="{ 
          '--item-count': techRow2.length,
          'animation-duration': (techRow2.length * 2.8) + 's' /* <-- CAMBIO CLAVE AQUI */
        }"
      >
        <!-- Bloque original -->
        <div class="tech-item" v-for="tech in techRow2" :key="tech.name">
          <img :src="tech.logoUrl" :alt="tech.name" />
          <p>{{ tech.name }}</p>
        </div>
        <!-- Bloque duplicado para el efecto infinito -->
        <div class="tech-item" v-for="tech in techRow2" :key="tech.name + '-clone'" aria-hidden="true">
          <img :src="tech.logoUrl" :alt="tech.name" />
          <p>{{ tech.name }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// El script no necesita cambios, la lógica sigue siendo la misma.
export default {
  name: "TechnologiesSection",
  data() {
    return {
      techRow1: [
        { name: "Java", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-plain.svg" },
        { name: "Spring Boot", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
        { name: "JavaScript", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg" },
        { name: "TypeScript", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-plain.svg" },
        { name: "Node.js", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-plain.svg" },
        { name: "Express", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
        { name: "Python", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-plain.svg" },
        { name: "Git", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-plain.svg" },
        { name: "GitHub", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      ],
      techRow2: [
        { name: "HTML5", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain.svg" },
        { name: "CSS3", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-plain.svg" },
        { name: "Sass", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" },
        { name: "React", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "Vue.js", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
        { name: "WordPress", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" },
        { name: "WooCommerce", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/woocommerce/woocommerce-plain.svg" },
        { name: "MySQL", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-plain-wordmark.svg" },
        { name: "PostgreSQL", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-plain-wordmark.svg" },
        { name: "Supabase", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" },
        { name: "MongoDB", logoUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-plain.svg" },
      ],
    };
  },
};
</script>

<style scoped>
@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(var(--item-width) * var(--item-count) * -1));
  }
}

.technologies-section {
  /* Se define la variable aquí para asegurar su scope */
  --item-width: 120px; 
  background-color: #14095b;
  color: #e0e0e0;
  font-family: 'Montserrat', sans-serif;
  padding: 2rem 0;
  width: 100%;
}

#tecno {
  text-align: center;
  margin-bottom: 2rem;
}

.slider-container {
  width: 100%;
  overflow: hidden;
  padding: 1rem 0;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
}

.slider-track {
  display: flex;
  width: calc(var(--item-width) * var(--item-count) * 2);
  
  /* <-- CAMBIO CLAVE: SEPARACIÓN DE PROPIEDADES --> */
  animation-name: scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  /* La 'animation-duration' se establece ahora mediante inline style */
}

#track2 {
  animation-direction: reverse;
}

.slider-container:hover .slider-track {
  animation-play-state: paused;
}

.tech-item {
  width: var(--item-width);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  box-sizing: border-box;
  transition: transform 0.2s ease-in-out;
}

.tech-item:hover {
  transform: scale(1.1);
}

.tech-item img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.tech-item p {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #c0c0c0;
  text-align: center;
  white-space: nowrap;
}
</style>```

