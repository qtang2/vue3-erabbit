import request from '@/utils/request'

/**
 * get product detail
 * @param {String} id - goods ID
 */
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

/**
 * get relecant goods, if no id param means get user may like goods
 * @param {String} id - 商品ID
 * @param {Number} limit - 获取条数
 */
export const findRelGoods = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'get', { id, limit })
}

/**
 * get hot products
 * @param {Number} type - 1代表24小时热销榜 2代表周热销榜 3代表总热销榜
 * @param {Number} limit - 获取个数
 */
export const findHotGoods = ({ id, type = 1, limit = 3 }) => {
  return request('/goods/hot', 'get', { id, type, limit })
}

/**
 * get comments
 * @param {String} id - product ID
 */
export const findCommentInfoByGoods = (id) => {
  // return request(`/goods/${id}/evaluate`)
  // axio wont add basedURL when url param starts with http / https
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
}

/**
 * get comments list
 * @param {String} id - product ID
 */
export const findCommentListByGoods = (id, params) => {
  // return request(`/goods/${id}/evaluate`)
  // axio wont add basedURL when url param starts with http / https
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
}
