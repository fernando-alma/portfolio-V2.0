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

