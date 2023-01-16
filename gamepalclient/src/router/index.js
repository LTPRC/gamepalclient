import { createRouter, createWebHashHistory } from 'vue-router'
// import App from '@/App.vue'
// import VueMeta from 'vue-meta'
// import Router from 'vue-router'
import loginComponent from '@/components/loginComponent'
import worldComponent from '@/components/worldComponent'
// import Initialization from '@/components/Initialization'

// const app = getCurrentInstance(App)
// app.use(VueMeta)
// app.use(Router)

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'loginComponent',
      component: loginComponent,
      children: []
    // },
    // {
    //   path: '/initialization',
    //   name: 'Initialization',
    //   component: Initialization,
    //   children: []
    },
    {
      path: '/world',
      name: 'worldComponent',
      component: worldComponent,
      children: []
    }
  ]
})
