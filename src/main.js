import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useUserStore } from './stores/user-store'
import { useAPIStore } from './stores/api-store'

import App from './App.vue'
import router from './router'

// import tailwind.css file
import './assets/css/tailwind.css'

const app = createApp(App)

app.use(createPinia())

const userStore = useUserStore()
const APIStore = useAPIStore()
app.provide('userStore', userStore)
app.provide('APIStore', APIStore)

app.use(router)

app.mount('#app')
