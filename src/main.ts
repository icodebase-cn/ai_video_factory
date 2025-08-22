import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import Toast, { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import 'virtual:uno.css'
import './assets/base.scss'

import { createApp } from 'vue'
import i18n from './i18n'
import router from './router/index.ts'
import store from './store/index.ts'
import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

// Set initial document title from i18n
document.title = i18n.global.t('app.name') as string

const app = createApp(App)

app.use(vuetify)
app.use(Toast, { position: 'bottom-left', pauseOnFocusLoss: false } as PluginOptions)
app.use(i18n)
app.use(router)
app.use(store)

app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })

  // Language switching from Electron menu
  window.ipcRenderer.on('set-locale', (_event, locale: string) => {
    // @ts-ignore
    i18n.global.locale.value = locale
    try {
      localStorage.setItem('locale', locale)
    } catch {}
    document.title = i18n.global.t('app.name') as string
  })
})
