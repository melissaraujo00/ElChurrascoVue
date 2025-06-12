import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import router from './router'
const pinia = createPinia()

app.use(pinia)
createApp(App).use(router).mount('#app')
