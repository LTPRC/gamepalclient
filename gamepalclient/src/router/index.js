import Vue from 'vue'
import VueMeta from 'vue-meta'
import Router from 'vue-router'
import Login from '@/components/Login'
import World from '@/components/World'

Vue.use(VueMeta)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/world',
      name: 'World',
      component: World
    }
  ]
})
