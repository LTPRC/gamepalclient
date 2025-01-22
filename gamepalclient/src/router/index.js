import { createRouter, createWebHashHistory } from 'vue-router'
// import App from '@/App.vue'
// import VueMeta from 'vue-meta'
// import Router from 'vue-router'
import loginComponent from '@/components/loginComponent'
import worldComponent from '@/components/worldComponent'
import gameoverComponent from '@/components/gameoverComponent'

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
    },
    {
      path: '/world',
      name: 'worldComponent',
      component: worldComponent,
      children: []
    },
    {
      path: '/gameover',
      name: 'gameoverComponent',
      component: gameoverComponent,
      children: []
    }
  ]
})
