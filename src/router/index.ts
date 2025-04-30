import { createRouter, createWebHistory } from 'vue-router'
import SensorView from '../views/SensorView.vue'
import LoginView from '../views/LoginView.vue'
import SensorListView from '../views/SensorListView.vue'
import RegisterSensorView from '../views/RegisterSensorView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/sensors/:id',
      name: 'sensor',
      component: SensorView,
      meta: { requiresAuth: true },
    },
    {
      path: '/',
      name: 'sensors',
      component: SensorListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/register-sensor',
      name: 'register-sensor',
      component: RegisterSensorView,
      meta: { requiresAuth: true },
    },
  ],
})

// Guardia de navegación global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  }
  // Si la ruta es solo para invitados y el usuario está autenticado
  else if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
  }
  // En cualquier otro caso, permitir la navegación
  else {
    next()
  }
})

export default router
