import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const routes = [
  { path: '/', redirect: '/home' },

  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiereAuth: true },
  },
  {
    path: '/catalog',
    name: 'catalog',
    component: () => import('../views/CatalogView.vue'),
    meta: { requiereAuth: true },
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiereAuth: true, soloAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ─── NAVIGATION GUARD ────────────────────────────────────────────────────────
router.beforeEach((to, from, next) => {
  const authStore      = useAuthStore();
  const autenticado    = authStore.estaAutenticado;
  const esAdmin        = authStore.esAdmin;

  // Ruta protegida sin sesión → login
  if (to.meta.requiereAuth && !autenticado) {
    return next({ name: 'login' });
  }

  // Ruta exclusiva de admin → 403 silencioso: redirige a home
  if (to.meta.soloAdmin && !esAdmin) {
    return next({ name: 'home' });
  }

  // Usuario ya logueado intenta ir a login/register → home
  if (autenticado && (to.name === 'login' || to.name === 'register')) {
    return next({ name: 'home' });
  }

  next();
});

export default router;