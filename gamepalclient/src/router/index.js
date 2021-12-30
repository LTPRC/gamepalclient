import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import World from '@/components/World'
import data from '../../static/configuration.json'

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
