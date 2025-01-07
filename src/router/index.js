import { createRouter, createWebHistory } from 'vue-router'
import { h } from 'vue'
import Layout from '../layout/index.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: '控制台', icon: 'dashboard' }
      },
      {
        path: 'compute',
        name: 'Compute',
        meta: { title: '计算', icon: 'Monitor' },
        children: [
          {
            path: 'ecs',
            name: 'ECS',
            component: () => import('../views/compute/ecs/index.vue'),
            meta: { title: '云服务器ECS' }
          },
          {
            path: '/dashboard/compute/ecs/:id',
            component: () => import('../views/compute/ecs/detail.vue'),
            meta: { title: '云服务器ECS' }
          },
        ]
      }
    ]
  },
  
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 云服务平台` : '云服务平台'
  
  // 判断是否需要登录权限
  if (to.path === '/login' || to.path === '/register') {
    next()
  } else {
    // 这里先模拟一个登录状态
    const isLogin = localStorage.getItem('token')
    isLogin ? next() : next('/login')
  }
})

export default router 