<!-- App.vue -->
<template>
  <div id="app">
    <router-view />
    <footer>
      <p>©2025 Fernando Alma - Desarrollo Web - Soulware Argentina </p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App"
}
</script>

<style>
body {
  background-color: #1a1a2e;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

#app {
  font-family: Arial, sans-serif;
  color: #333;
  text-align: center;
  max-width: 100%;
  overflow-x: hidden;
  padding-top: 0.5rem; /* Altura del navbar */
}

footer {
  background-color: #3209c7;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  font-size: 1.3rem;
}

footer p {
  font-size: 1rem;
  color: #ffffff;
  text-align: center;
}
</style>