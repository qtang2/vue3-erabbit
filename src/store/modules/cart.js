import { getNewCartGoods } from '@/api/cart'

export default {
  namespaced: true,
  state: () => {
    return {
      list: []
    }
  },
  getters: {
    // effective list
    validList (state) {
      // stock > 0 , isEffective ture
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // effective total quality
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // effective total amount
    validAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count * c.nowPrice * 100, 0) / 100
    }
  },
  mutations: {
  // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
  // 线上：比上面多 isCollect 有用 discount 无用 两项项信息
    insertCart (state, payload) {
      // combine old list and new payload
      // add quality if add same product
      // add product if no same one
      const sameIndex = state.list.findIndex(good => good.skuId === payload.skuId)
      // if find same product, add quality, delete original item in the list, add product at the begining of the list
      if (sameIndex > -1) {
        const count = state.list[sameIndex].count
        payload.count += count
        // delete original
        state.list.splice(sameIndex, 1)
      }
      // add prod
      state.list.unshift(payload)
    },
    // update cart goods
    updateCart (state, goods) {
      // update goods attr based on the goods var passed in
      // and need to validate the value of the attributes
      // goods var must have skuId
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (const key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    }
  },
  actions: {
    insertCart (ctx, payload) {
      // 1. insertCart when login
      // 2. insertCart when not login
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // TODO: logged in
        } else {
          // no login
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    findCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // TODO: logged in
        } else {
          // no login
          // send requests based on how many goods you have, after all request  succeed, then update local cart data
          // Promise.all() 可以并列发送多个请求，等所有请求成功，调用then
          // Promise.race() 可以并列发送多个请求，等最快的请求成功，调用then
          const promiseArr = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })

          Promise.all(promiseArr).then(dataList => {
            dataList.forEach((data, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
            })

            resolve()
          })
        }
      })
    }
  }
}
