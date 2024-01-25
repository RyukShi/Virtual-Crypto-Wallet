import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'

import App from './App.vue'
import router from './router'

// import tailwind.css file
import './assets/css/tailwind.css'
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
// Import Quasar css
import 'quasar/src/css/index.sass'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Quasar, {
    plugins: {}
})

app.mount('#app')
