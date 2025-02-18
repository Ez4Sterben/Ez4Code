import { createRouter, createWebHashHistory } from 'vue-router'
import MainPage from '../components/MainPage.vue'
import ProjectPage from '../components/ProjectPage.vue'

const routes = [
  { path: '/', component: MainPage },
  { path: '/project', component: ProjectPage }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 