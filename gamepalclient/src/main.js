// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueAxios from './plugins/axios'
import VueMeta from 'vue-meta'
import md5 from 'js-md5'
import App from './App'
import router from './router'
import scenes from '../static/scenes.json'

Vue.config.productionTip = false
Vue.use(VueAxios)
Vue.use(VueMeta, {
  keyName: 'head'
})
Vue.prototype.$md5 = md5
Vue.prototype.$scenes = scenes
Vue.prototype.$hostDev = '127.0.0.1'
Vue.prototype.$hostPrd = '175.27.132.83'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
