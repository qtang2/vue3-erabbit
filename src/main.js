import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css'
import '@/assets/styles/common.less'

// import customized component
import UI from './components/library'

import './mock'

createApp(App).use(store).use(router).use(UI).mount('#app')
