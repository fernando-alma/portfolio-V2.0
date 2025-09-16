<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <button class="hamburger" :class="{ 'is-active': isMenuOpen }" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <div class="navbar-menu" :class="{ 'is-open': isMenuOpen }">
      <ul class="nav-list">
        <li>
          <router-link to="/" class="nav-item" @click="closeMenu">Inicio</router-link>
        </li>
        <li v-for="nav in navegacion" :key="nav.id">
          <router-link :to="{ path: '/', hash: nav.enlace }" class="nav-item" @click="closeMenu">
            {{ nav.nombre }}
          </router-link>
        </li>
        <li>
          <router-link to="/portfolio-completo" class="nav-item" @click="closeMenu">
            Portfolio Completo
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);
const navegacion = ref([
  { id: 1, nombre: 'Experiencia', enlace: '#experiencia' },
  { id: 2, nombre: 'Proyectos', enlace: '#proyect' },
  { id: 3, nombre: 'Contacto', enlace: '#contacto' },
  { id: 4, nombre: 'Tecnologías', enlace: '#tecno' },
]);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : '';
};

const closeMenu = () => {
  isMenuOpen.value = false;
  document.body.style.overflow = '';
};
</script>

<style scoped>
.navbar {
  background: #3209c7e4;
  color: #fff;
  padding: 1.0rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.navbar-menu {
  width: 100%;
  max-width: 1200px;
}

.nav-list {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
}

.nav-item {
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hamburger {
  display: none;
}

@media (max-width: 768px) {
  .hamburger {
    display: block;
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1001;
  }

  .hamburger span {
    display: block;
    width: 25px;
    height: 3px;
    background: #fff;
    margin: 5px 0;
    transition: all 0.3s ease;
  }

  .hamburger.is-active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .hamburger.is-active span:nth-child(2) {
    opacity: 0;
  }

  .hamburger.is-active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }

  .navbar-menu {
    position: fixed;
    top: 0;
    left: -100%;
    height: 100vh;
    width: 100%;
    background: #3209c7;
    padding-top: 4rem;
    transition: all 0.3s ease;
  }

  .navbar-menu.is-open {
    left: 0;
  }

  .nav-list {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .nav-item {
    font-size: 1.2rem;
    width: 100%;
    text-align: center;
    padding: 1rem;
  }
}
</style>
