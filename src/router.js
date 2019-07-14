import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Feed from './views/Feed.vue'
import Perfil from './views/perfil.vue'
import CrearProyecto from '@/views/Crear_Proyecto.vue'
import Resultados from '@/views/Resultados.vue'
import Peticion from './views/Peticion.vue'
import Informacion from './components/Informacion.vue'
import Login from './views/Login.vue'
import Registrar from './views/Registrar.vue'
import notFound from '@/views/error404.vue'
import Proyecto from '@/views/Perfil_Proyecto.vue'
import store from './store'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/registrar',
      name: 'registrar',
      component: Registrar
    },
    {
      path: '/peticion',
      name: 'Peticion',
      component: Peticion
    },
    {
      path: '/informacion',
      name: 'Informacion',
      component: Informacion
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/Feed',
      name: 'feed',
      component: Feed,
      meta: {
        requiresAuth: true,
        requiresUpdate: true,
      }
    },
    {
      path: '/perfil/:username',
      name: 'perfil',
      component: Perfil,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/proyectos/:slug_name',
      name: 'proyectos',
      component: Proyecto,
      meta: {
        requiresAuth: true,
        requiresUpdate: true,
      }
    },
    {
      path: '/crear_proyecto',
      name: 'crearProyecto',
      component: CrearProyecto,
      meta: {
        requiresAuth: true,
        requiresUpdate: true,
      }
    },
    {
      path: '/busqueda',
      name: 'busqueda',
      component: Resultados,
      meta: {
        requiresAuth: true,
        requiresUpdate: true,
      }
    },
    // {
    //   path: '/proyectos',
    //   name: 'proyectos',
    //   component: Proyectos,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    {
      path: '/not-found',
      name: 'not-found',
      component: notFound,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})


// Handling authentication
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresUpdate)) {
    store.dispatch('updateUser');
  }
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default router
