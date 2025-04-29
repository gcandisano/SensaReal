import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
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
      component: RegisterView,
      meta: { requiresGuest: true },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/register-sensor',
      name: 'register-sensor',
      component: () => import('../views/RegisterSensorView.vue'),
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
