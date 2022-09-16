import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CryptoMarketplaceView from '../views/CryptoMarketplaceView.vue'
import FiatMarketplaceView from '../views/FiatMarketplaceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/crypto',
      name: 'crypto',
      component: CryptoMarketplaceView
    },
    {
      path: '/crypto/:cryptoId',
      name: 'crypto-details',
    },
    {
      path: '/fiat',
      name: 'fiat',
      component: FiatMarketplaceView
    },
    {
      path: '/fiat/:fiatId',
      name: 'fiat-details',
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'home' }
    }
  ]
})

export default router
