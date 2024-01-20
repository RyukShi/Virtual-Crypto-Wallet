import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AssetDetailsView from '../views/AssetDetailsView.vue'
import MarketplaceView from '../views/MarketplaceView.vue'
import UserWalletView from '../views/UserWalletView.vue'
import SwappingAssetsView from '../views/SwappingAssetsView.vue'
import { useUserStore } from '../stores/user-store'

const isAuthenticatedFully = (to, _from, next) => {
  const userStore = useUserStore()
  if (to.name !== 'login' && !userStore.isAuthenticated) next({ name: 'login' })
  else next()
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'marketplace',
      component: MarketplaceView
    },
    {
      path: '/asset-details/:assetId',
      name: 'asset-details',
      component: AssetDetailsView,
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
      component: UserWalletView,
      beforeEnter: [isAuthenticatedFully]
    },
    {
      path: '/account-recovery',
      name: 'account-recovery',
      component: () => import('../views/AccountRecoveryView.vue')
    },
    {
      path: '/recovery-password',
      name: 'recovery-password',
      component: () => import('../views/RecoveryPasswordView.vue'),
      beforeEnter: (to, _from, next) => {
        const hash = to.hash
        if (!hash) next({ name: 'marketplace' })
        else {
          const urlParams = new URLSearchParams(hash.slice(1))
          const error = urlParams.get('error')
          if (error) {
            const errorCode = urlParams.get('error_code')
            const errorDescription = urlParams.get('error_description')
            alert(`Error ${errorCode}: ${errorDescription}`)
            next({ name: 'marketplace' })
          }
          const accessToken = urlParams.get('access_token')
          if (!accessToken) next({ name: 'marketplace' })
          else next()
        }
      }
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    },
    {
      path: '/swapping/:assetId',
      name: 'swapping',
      component: SwappingAssetsView,
      beforeEnter: [isAuthenticatedFully]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'not-found' }
    }
  ]
})

export default router
