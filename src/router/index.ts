import { createRouter, createWebHistory } from 'vue-router'
import SearchPage from '../pages/SearchPage.vue'
import TripsPage from '../pages/TripsPage.vue'

const routes = [
  {
    path: '/',
    name: 'search',
    component: SearchPage,
  },
  {
    path: '/trips',
    name: 'trips',
    component: TripsPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
