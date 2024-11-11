<!-- App.vue -->
<template>
  <div id="app">
    <NavBar />
    <About />
    <Education />
    <Projects />
    <Contact />
    <Technologies />
   
  </div>

  <footer>
    <p>©2024 Fernando Alma - Desarrollo Web - Soulware Argentina </p>
  </footer>
</template>

<script>
import NavBar from './components/NavBar.vue';
import About from "./components/About.vue";
import Projects from "./components/Projects.vue";
import Contact from "./components/Contact.vue";
import Education from "./components/Education.vue";
import Technologies from "./components/Technologies.vue";

export default {
  name: "App",
  components: {
    NavBar,
    About,
    Projects,
    Contact,
    Education,
    Technologies,
  },
};
</script>

<style>

body { 
  background-color: #1a1a2e;
  margin-top: 10px;
  margin-bottom: 10px;
}

#app {
  font-family: Arial, sans-serif;
  color: #333;
  text-align: center;
}
header {
  background-color: #3209c7;
  color: white;
  padding: 20px 0;
  margin-bottom: 20px;
}

footer {
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  font-size: 1.3rem;
}

footer a {
  text-decoration: none;
  color: #31aa12;
  margin-bottom: 1rem;
  font-weight: bold;
}

footer a:hover {
  text-decoration: underline;
}

footer p {
  font-size: 1rem;
  color: #ffffff;
  text-align: center;
  margin-top: 0.5rem;
}
</style>
