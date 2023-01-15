import { createApp } from 'vue'
// import { getCurrentInstance } from 'vue'
import App from './App.vue'
// import axios from './plugins/axios'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueMeta from 'vue-meta'
import md5 from 'js-md5'
// import router from 'router'
// import VueRouter from 'vue-router'
import router from './router'
import scenes from '../static/scenes.json'
import items from '../static/items.json'

const app = createApp(App)
app.mount('#app')
// app.config.globalProperties.$axios=axios;
// app.provide('$axios', axios)
app.use(VueAxios, axios)
// app.config.productionTip = false
app.use(VueMeta, {
  keyName: 'head'
})
app.use(router)
app.config.globalProperties.$md5 = md5
app.config.globalProperties.$scenes = scenes
app.config.globalProperties.$items = items
// app.prototype.$hostDev = '127.0.0.1'
// app.prototype.$hostPrd = '175.27.132.83'
