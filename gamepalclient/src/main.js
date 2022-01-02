// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueAxios from './plugins/axios'
import md5 from 'js-md5'
import App from './App'
import router from './router'

Vue.config.productionTip = false
Vue.use(VueAxios)
Vue.prototype.$md5 = md5;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
