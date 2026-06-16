import { createApp } from 'vue'
import App from './App.vue'
import { initTheme } from '@/utils/applyTheme'

import '@/styles/themes.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'admin-lte/dist/css/adminlte.min.css'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

initTheme()

document.body.classList.add(
  'layout-fixed',
  'sidebar-expand-lg',
  'bg-body-tertiary',
  'app-loaded'
)

const app = createApp(App)

app.config.errorHandler = (err) => {
  console.error(err)
}

try {
  app.mount('#app')
} catch (e) {
  console.error(e)
  const el = document.getElementById('app')
  if (el) {
    el.innerHTML = `<p style="padding:1rem;font-family:system-ui">App failed to start. Check the console for details.</p>`
  }
}

/* Load after Vue mounts so a bundler/runtime issue here cannot block the app shell */
import('admin-lte/dist/js/adminlte.min.js').catch((err) => {
  console.warn('AdminLTE JS did not load; sidebar toggles may be limited.', err)
})
