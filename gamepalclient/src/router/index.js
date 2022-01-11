import Vue from 'vue'
import VueMeta from 'vue-meta'
import Router from 'vue-router'
import Login from '@/components/Login'
import World from '@/components/World'
import Initialization from '@/components/Initialization'

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
      path: '/initialization',
      name: 'Initialization',
      component: Initialization
    },
    {
      path: '/world',
      name: 'World',
      component: World
    }
  ]
})
