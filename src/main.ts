import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/variables.css'
import './assets/styles/base.css'
import './assets/styles/layout.css'
import './assets/styles/components/button.css'
import './assets/styles/components/trip-card.css'
import './assets/styles/components/seat-grid.css'
import './assets/styles/pages/search-page.css'
import './assets/styles/pages/trips-page.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
