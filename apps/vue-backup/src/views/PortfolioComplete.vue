<template>
  <div class="portfolio-complete-page">
    <NavBar />
    <PortfolioCatalog />
  </div>
  
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import PortfolioCatalog from '@/components/Catalog.vue'

export default {
  name: 'PortfolioComplete',
  components: {
    NavBar,
    PortfolioCatalog,
  },
}
</script>

<style>
.portfolio-complete-page {
  min-height: 100vh;
  background-color: #14095b;
  max-width: 100%;
}
</style>