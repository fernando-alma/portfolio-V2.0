<script>
export default {
  name: "EducationSection"
};
</script>
<script setup>
import { ref } from 'vue';

const fechaColor = ref([
  { color: '#41516c' },
  { color: '#FBCA3E' },
  { color: '#E24A68' },
  { color: '#1B5FBC' },
  { color: '#4CADAD' }
]);

const educacion = ref([
  { fecha: '2025', title: 'Finalización de la Tecnicatura Universitaria en Programación - Inicio de especialización Backend en JAVA en ORACLE ALURA ONE', descripcion: 'Graduación de la Tecnicatura Universitaria en Programación UTN FRSR' },
  { fecha: '2024', title: 'Inicio de la Tecnicatura Universitaria en Programación UTN FRSR - Finalización de la Diplomatura Universitaria en Programación UTN BA', descripcion: 'Cursado del Primer año de la Tecnicatura Universitaria en Programación UTN FRSR - Graduación de la Diplomatura Universitaria en Programación UTN BA' },
  { fecha: '2023', title: 'Inicio de la Diplomatura Universitaria en Programación UTN BA - Fundación de mi marca personal SOULWARE', descripcion: 'Introducción a tecnologías como JavaScript, HTML, CSS, Sass, React.js, Node.js, Mongo DB, MySQL, TypeScript, Express, entre otras - Inicié como Programador Web en mi marca personal de forma freelance' },
  { fecha: '2022 - 2023', title: 'Cursado de Ingeniería Informática UM - Primer experiencia como FullStack Web Developer UNDER AGENCY', descripcion: 'Realicé el cursado de la carrera en la Universidad de Mendoza (Parcial) - Inicié mi primer trabajo como Programador Web en una agencia de Marketing Digital' },
  { fecha: '2014 - 2021', title: 'Cursado de Ingeniería Electrónica UM - Finalización del curso de Desarrollo Web FullStack Java EGG', descripcion: 'Realicé el cursado de la carrera en la Universidad de Mendoza (Parcial) - Graduación Desarrollo Web FullStack EGG' }

]);
</script>



<template>
    <h1 id=experiencia> Experiencia </h1>
   
  <ul>
    <li v-for="(item, index) in educacion" :key="index" :style="{ '--fecha-color': fechaColor[index].color }">
      <div class="fecha">{{ item.fecha }}</div>
      <h3 class="title">{{ item.title }}</h3>
      <div class="descripcion">{{ item.descripcion }}</div>
    </li>
  </ul>

</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap");

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-height: 100vh;
  display: grid;
  align-content: center;
  gap: 2rem;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
  color: var(--color);
  background: var(--bgColor);
}

#experiencia {
 color: aliceblue;
margin-bottom: 45px;
}

ul {
  --col-gap: 2rem;
  --row-gap: 2rem;
  --line-w: 0.25rem;
  display: grid;
  grid-template-columns: var(--line-w) 1fr;
  grid-auto-columns: max-content;
  column-gap: var(--col-gap);
  list-style: none;
  width: min(60rem, 90%);
  margin-inline: auto;
}

/* line */
ul::before {
  content: "";
  grid-column: 1;
  grid-row: 1 / span 20;
  background: rgb(225, 225, 225);
  border-radius: calc(var(--line-w) / 2);
}

/* columns*/
ul li:not(:last-child) {
  margin-bottom: var(--row-gap);
}

/* card */
ul li {
  grid-column: 2;
  --inlineP: 1.5rem;
  margin-inline: var(--inlineP);
  grid-row: span 2;
  display: grid;
  grid-template-rows: min-content min-content min-content;
}

/* date */
ul li .fecha {
  --dateH: 3rem;
  height: var(--dateH);
  margin-inline: calc(var(--inlineP) * -1);
  text-align: center;
  background-color: var(--fecha-color);
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  display: grid;
  place-content: center;
  position: relative;
  border-radius: calc(var(--dateH) / 2) 0 0 calc(var(--dateH) / 2);
}

/* date flap */
ul li .fecha::before {
  content: "";
  width: var(--inlineP);
  aspect-ratio: 1;
  background: var(--fecha-color);
  background-image: linear-gradient(rgba(0, 0, 0, 0.2) 100%, transparent);
  position: absolute;
  top: 100%;
  clip-path: polygon(0 0, 100% 0, 0 100%);
  right: 0;
}

/* circle */
ul li .fecha::after {
  content: "";
  position: absolute;
  width: 2rem;
  aspect-ratio: 1;
  background: var(--bgColor);
  border: 0.3rem solid var(--fecha-color);
  border-radius: 50%;
  top: 50%;
  transform: translate(50%, -50%);
  right: calc(100% + var(--col-gap) + var(--line-w) / 2);
}

/* title & description */
ul li .title,
ul li .descripcion {
    color: aliceblue;
  background: var(--bgColor);
  position: relative;
  padding-inline: 1.5rem;
}

ul li .title {
  overflow: hidden;
  padding-block-start: 1.5rem;
  padding-block-end: 1rem;
  font-weight: 500;
  font-size: 1.2rem;
}

ul li .descripcion {
  padding-block-end: 1.5rem;
  font-weight: 300;
  font-size: 1rem;
}

/* shadows */
ul li .title::before,
ul li .descripcion::before {
  content: "";
  position: absolute;
  width: 90%;
  height: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  left: 50%;
  border-radius: 50%;
  filter: blur(4px);
  transform: translate(-50%, 50%);
}

ul li .title::before {
  bottom: calc(100% + 0.125rem);
}

ul li .descripcion::before {
  z-index: -1;
  bottom: 0.25rem;
}

@media (min-width: 40rem) {
  ul {
    grid-template-columns: 1fr var(--line-w) 1fr;
  }
  ul::before {
    grid-column: 2;
  }
  ul li:nth-child(odd) {
    grid-column: 1;
  }
  ul li:nth-child(even) {
    grid-column: 3;
  }

  /* start second card */
  ul li:nth-child(2) {
    grid-row: 2/4;
  }

  ul li:nth-child(odd) .fecha::before {
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    left: 0;
  }

  ul li:nth-child(odd) .fecha::after {
    transform: translate(-50%, -50%);
    left: calc(100% + var(--col-gap) + var(--line-w) / 2);
  }

  ul li:nth-child(odd) .fecha {
    border-radius: 0 calc(var(--dateH) / 2) calc(var(--dateH) / 2) 0;
  }
}
</style>