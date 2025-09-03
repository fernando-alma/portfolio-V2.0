import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import PortfolioComplete from '@/views/PortfolioComplete.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/portfolio-completo',
    name: 'PortfolioComplete',
    component: PortfolioComplete
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0 }
  }
})

export default router