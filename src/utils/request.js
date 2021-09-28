import axios from 'axios'
import store from '@/store'
import router from '@/router'

export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'

const instance = axios.create({
  baseURL,
  timeout: 5000
})

// request interceptor
instance.interceptors.request.use(config => {
  const { profile } = store.state.user
  // if user has token
  if (profile.token) {
    // configure header with the token
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  console.log('request interceptor err ', err)
  return Promise.reject(err)
})

// request interceptor
instance.interceptors.response.use(res => res.data, err => {
  // 401 status which means invalid token
  if (err.response && err.response.status === 401) {
    // 1. clearn user data
    // 2. jump to login with passed path params
    store.commit('user/setUser', {})
    // js模块中：router.currentRoute.value.fullPath 就是当前路由地址，router.currentRoute 是ref响应式数据
    // encodeURIComponent will encode url path
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)

    router.push('/login?redirectUrl=' + fullPath)
  }
  console.log('response interceptor err ', err)
  return Promise.reject(err)
})

export default (url, method, submitData) => {
  return instance({
    url,
    method,
    // dynamically set key as params or data
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
