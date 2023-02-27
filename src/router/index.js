import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AssetDetailsView from '../views/AssetDetailsView.vue'
import MarketplaceView from '../views/MarketplaceView.vue'
import UserWalletView from '../views/UserWalletView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'marketplace',
      component: MarketplaceView
    },
    {
      path: '/asset-details',
      name: 'asset-details',
      component: AssetDetailsView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/my-wallet',
      name: 'my-wallet',
      component: UserWalletView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'home' }
    }
  ]
})

export default router
