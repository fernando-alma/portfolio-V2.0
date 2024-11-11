<template>
    <nav class="navbar">
      <div class="navbar-menu">
        <ul class="nav-list">
          <li v-for="nav in navegacion" :key="nav.id">
            <a :href="nav.enlace" class="nav-item">{{ nav.nombre }}</a>
          </li>
        </ul>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const navegacion = ref([
    { id: 1, nombre: 'Experiencia', enlace: '#experiencia' },
    { id: 2, nombre: 'Proyectos', enlace: '#proyect' },
    { id: 3, nombre: 'Contacto', enlace: '#contacto' },
    { id: 4, nombre: 'Tecnologías', enlace: '#tecno' },
  ]);
  </script>
  
  <style scoped>
  /* Estilos generales */
  .navbar {
    background: linear-gradient(90deg, #321574, #21089b, #3e0ec4);
    color: #fff;
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    z-index: 10; /* Asegura que el navbar esté encima de otros elementos */
    margin-top: 5px;
    margin-bottom: 10px;
    
    /* Efecto sticky */
    position: sticky;
    top: 0;
  }
  
  .navbar-menu {
    display: flex;
    justify-content: center;
    width: 100%;
    z-index: 1;
  }
  
  .nav-list {
    list-style: none;
    display: flex;
    flex-wrap: nowrap;
    padding: 0;
    margin: 0;
  }
  
  .nav-item {
    color: #fff;
    text-decoration: none;
    margin: 0 0.5rem;
    padding: 5px 10px;
    border: 1px solid transparent;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s, border 0.3s;
    font-size: 1rem;
    white-space: nowrap;
  }
  
  .nav-item:hover {
    background-color: #4e4cb1;
    color: white;
    border: 1px solid hsla(0, 0%, 100%, 0.6);
  }
  
  @media (max-width: 768px) {
    .nav-item {
      font-size: 0.85rem;
      padding: 5px 8px;
      margin: 0 0.3rem;
    }
  }
  </style>
  