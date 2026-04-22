import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import RegisterView from '../views/RegisterView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login',    component: LoginView },
  { path: '/register', component: RegisterView },
  {
    path: '/home',
    component: HomeView,
    meta: { requiereAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ─── NAVIGATION GUARD ────────────────────────────────────────────────────────
// El store se llama dentro del guard (no en el top-level) para evitar el
// problema de "store usado antes de que Pinia esté montado"
router.beforeEach((to) => {
  const authStore = useAuthStore();
  const requiereAuth = to.meta.requiereAuth;

  // Si la ruta necesita auth y el usuario no está autenticado → redirige al login
  if (requiereAuth && !authStore.estaAutenticado) {
    return '/login';
  }

  // Si ya está autenticado e intenta ir a login/register → redirige a /home
  if (authStore.estaAutenticado && (to.path === '/login' || to.path === '/register')) {
    return '/home';
  }
});

export default router;