import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{
        path: '/welcome',
        component: () => import('../components/index/Welcome.vue')
      }, {
        path: '/users',
        component: () => import('../components/user/Users.vue')
      },
      {
        path: '/rights',
        component: () => import('../components/power/Rights.vue')
      },
      {
        path: '/roles',
        component: () => import('../components/power/Roles.vue')
      },
    ]
  }
]


const router = new VueRouter({
  routes
})

// 增加路由守卫
router.beforeEach((to, from, next) => {
  // 如果访问登录页面，则放行
  if (to.path === '/login') {
    return next()
  }
  // 用户未登录，则跳转至login
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  if (!userInfo) {
    return next('./login')
  }
  next()
})


export default router