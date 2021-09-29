import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state () {
    return {
      list: topCategory.map(item => ({ name: item }))
    }
  },
  mutations: {
    setList (state, payload) {
      state.list = payload
    },
    // control open value of current category
    show (state, item) {
      const category = state.list.find(category => item.id === category.id)
      category.open = true
    },
    hide (state, item) {
      const category = state.list.find(category => item.id === category.id)
      category.open = false
    }
  },
  actions: {
    async getList ({ commit }) {
      const { result } = await findAllCategory()

      // add open attri to control class hide and show
      result.forEach(item => { item.open = false })
      commit('setList', result)
    }
  }
}
