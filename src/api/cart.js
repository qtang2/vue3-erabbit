import request from '@/utils/request'

/**
 * get goods latest price, stock, isEffective info
 */
export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}

/**
 * get specs and skus
 * @param {String} skuId - product SKUID
 * @returns Promise
 */
export const getSpecsAndSkus = (skuId) => {
  return request(`/goods/sku/${skuId}`, 'get')
}

/**
 * combine local cart with server cart
 * @param {Array<object>} cartList - include skuId, selected, count
 * @param {String} object.skuId -SKUID
 * @param {Boolean} object.selected - selected
 * @param {Integer} object.count - quality
 */
export const mergeLocalCart = (cartList) => {
  return request('/member/cart/merge', 'post', cartList)
}

/**
 * get cart from server after login
 * @returns Promise
 */
export const findCartList = () => {
  return request('/member/cart', 'get')
}

/**
 * add goods to cart
 * @param {String} skuId - SKUID
 * @param {Integer} count - quality
 * @returns Promise
 */
export const insertCart = ({ skuId, count }) => {
  return request('/member/cart', 'post', { skuId, count })
}

/**
 * delete goods in cart
 * @param {Array<string>} ids - skuId array
 * @returns Promise
 */
export const deleteCart = (ids) => {
  return request('/member/cart', 'delete', { ids })
}

/**
 * update goods selected and count in cart
 * @param {String} goods.skuId - skuId
 * @param {Boolean} goods.selected
 * @param {Integer} goods.count
 * @returns Promise
 */
export const updateCart = ({ skuId, selected, count }) => {
  return request(`/member/cart/${skuId}`, 'put', { skuId, selected, count })
}

/**
 * check all, non check
 * @param {Boolean} selected
 * @param {Array<string>} ids - valid products skuId array
 * @returns Promise
 */
export const checkAllCart = ({ selected, ids }) => {
  return request('/member/cart/selected', 'put', { selected, ids })
}
