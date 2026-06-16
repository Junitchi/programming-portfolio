import { createApp } from 'vue'
import App from './App.vue'
import { initTheme } from '@/utils/applyTheme'

// CSS import order matters: token layer FIRST so it wins over AdminLTE/Bootstrap.
import '@/styles/themes.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'admin-lte/dist/css/adminlte.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

// Set html[data-theme] before mount/paint.
initTheme()

createApp(App).mount('#app')
