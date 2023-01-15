import { getCurrentInstance } from 'vue'
import App from './App.vue'
import VueMeta from 'vue-meta'
import Router from 'vue-router'
import loginComponent from '@/components/loginComponent'
import worldComponent from '@/components/worldComponent'
// import Initialization from '@/components/Initialization'

const app = getCurrentInstance(App)
app.use(VueMeta)
app.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'loginComponent',
      component: loginComponent
    // },
    // {
    //   path: '/initialization',
    //   name: 'Initialization',
    //   component: Initialization
    },
    {
      path: '/world',
      name: 'worldComponent',
      component: worldComponent
    }
  ]
})
