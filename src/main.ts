import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import 'virtual:uno.css'
import './assets/base.scss'

import { createApp } from 'vue'
import GlobalSetting from '../setting.global'
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

document.title = GlobalSetting.appName

const app = createApp(App)

app.use(vuetify)
app.use(router)
app.use(store)

app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
