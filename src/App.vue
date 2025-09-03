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