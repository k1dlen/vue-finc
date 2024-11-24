import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Dashboard from '../views/DashBoard.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Settings from '../views/Settings.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/settings', name: 'Settings', component: Settings },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
