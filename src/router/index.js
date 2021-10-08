import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home/index')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods/index')
const Login = () => import('@/views/login/index')
const LoginCallback = () => import('@/views/login/callback')
const Cart = () => import('@/views/cart/index')
const Checkout = () => import('@/views/member/pay/checkout')
const PayIndex = () => import('@/views/member/pay/index')
const PayResult = () => import('@/views/member/pay/result')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
      { path: '/cart', component: Cart },
      { path: '/member/checkout', component: Checkout },
      { path: '/member/pay', component: PayIndex },
      { path: '/pay/callback', component: PayResult }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/login/callback',
    component: LoginCallback
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () {
    // every time routes change where page should go
    // vue2 : x, horizontal scroll length, y vertical
    // vue3 : use left and top instead
    return { left: 0, top: 0 }
  }
})

// router guard
router.beforeEach((to, from, next) => {
  // route start with /member need to login first
  const { profile } = store.state.user
  if (!profile.token && to.path.startsWith('/member')) {
    next({ path: '/login', query: { redirectUrl: to.fullPath } })
  }
  next()
})

export default router
