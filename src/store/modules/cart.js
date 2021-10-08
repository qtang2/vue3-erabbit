import { findCartList, getNewCartGoods, mergeLocalCart, insertCart, deleteCart, updateCart, checkAllCart } from '@/api/cart'

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
    },
    // invalid goods
    invalidList (state) {
      return state.list.filter(goods => goods.stock <= 0 || !goods.isEffective)
    },
    // chosen goods
    selectedList (state, getters) {
      return getters.validList.filter(goods => goods.selected)
    },
    // chose goods total
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // chose goods amount
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count * c.nowPrice * 100, 0) / 100
      // return getters.validList.reduce((p, c) => p + c.count * Math.round(c.nowPrice * 100), 0) / 100
    },
    // is selected all goods
    isCheckAll (state, getters) {
      return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length
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
    },
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // set cart list, can set to empty can renew
    setCartList (state, list) {
      state.list = list
    }
  },
  actions: {
    // add good to cart
    insertCart (ctx, payload) {
      // 1. insertCart when login
      // 2. insertCart when not login
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // logged in
          insertCart({ skuId: payload.skuId, count: payload.count }).then(() => {
            return findCartList().then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
          })
        } else {
          // no login
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // get latest goods inof and update cart
    findCart (ctx) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // logged in
          findCartList().then(data => {
            ctx.commit('setCartList', data.result)
            resolve()
          })
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
    },
    // delete single product in cart
    deleteCart (ctx, skuId) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          deleteCart([skuId]).then(() => {
            return findCartList().then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
          })
        } else {
          ctx.commit('deleteCart', skuId)
          resolve()
        }
      })
    },
    // update cart goods info
    updateCart (ctx, payload) {
      // payload must have skuId, might have selected, count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // logged in
          updateCart(payload).then(() => {
            return findCartList().then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
          })
        } else {
          // no login
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // check or cancel selected all goods in cart
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // logged in
          const ids = ctx.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids }).then(() => {
            return findCartList().then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
          })
        } else {
          // no login
          ctx.getters.validList.forEach(goods => {
            ctx.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // batch delete
    batchDeleteCart (ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // login in
          const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids).then(() => {
            return findCartList().then(data => {
              ctx.commit('setCartList', data.result)
              resolve()
            })
          })
        } else {
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            ctx.commit('deleteCart', item.skuId)
          })
          resolve()
        }
      })
    },
    // update cart goods info
    updateCartSku (ctx, { oldSkuId, newSku }) {
      // payload must have skuId, might have selected, count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // logged in
          // get old sku infor
          // delete old sku info
          // combine old goods count and new skuId, add to cart
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldGoods.skuId]).then(() => {
            return insertCart({ skuId: newSku.skuId, count: oldGoods.count }).then(() => {
              return findCartList().then(data => {
                ctx.commit('setCartList', data.result)
                resolve()
              })
            })
          })
        } else {
          // no login
          // get old sku infor
          // delete old sku info
          // combine old and new sku info, add to cart
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          ctx.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // merge local cart and serverside cart
    async mergeCart (ctx) {
      const cartList = ctx.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeLocalCart(cartList)

      ctx.commit('setCartList', [])
    }
  }
}
