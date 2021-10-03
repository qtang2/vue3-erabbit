import { createStore } from 'vuex'

import user from './modules/user'
import cart from './modules/cart'
import category from './modules/category'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  modules: {
    user,
    cart,
    category
  },
  plugins: [
    createPersistedState({
      key: 'erabbit-client-pc-store',
      paths: ['user', 'cart']
    })
  ]
})
