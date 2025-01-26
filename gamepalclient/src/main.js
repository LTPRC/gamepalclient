import { createApp } from 'vue'
// import { getCurrentInstance } from 'vue'
import App from './App.vue'
// import axios from './plugins/axios'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import VueMeta from 'vue-meta'
import md5 from 'js-md5'
// import router from 'router'
// import VueRouter from 'vue-router'
// import echarts from 'echarts'
import router from './router'
import items from '../static/items.json'
import blockImageIds from '../static/blockImageIds.json'
// import blockImages1000 from '../static/images/blocks/1000.png'

const app = createApp(App)
// app.config.globalProperties.$axios=axios;
// app.provide('$axios', axios)
app.use(VueAxios, axios)
// app.config.productionTip = false
// app.use(VueMeta, {
//   keyName: 'head'
// })
app.use(router)
app.config.globalProperties.$md5 = md5
app.config.globalProperties.$items = items
app.config.globalProperties.$blockImageIds = blockImageIds
// app.config.globalProperties.$blockImages1000 = blockImages1000
app.config.globalProperties.$hostDev = '127.0.0.1'
app.config.globalProperties.$hostQa = '192.168.2.8'
app.config.globalProperties.$hostPrd = '175.27.132.83'
app.mount('#app')

import { constants } from './constants.js'
app.config.globalProperties.$constants = constants;

import { utilMethods } from './util.js'
app.config.globalProperties.$utilMethods = utilMethods;

import { drawMethods } from './draw.js'
app.config.globalProperties.$drawMethods = drawMethods;

import { drawBlockMethods } from './drawBlock.js'
app.config.globalProperties.$drawBlockMethods = drawBlockMethods;
