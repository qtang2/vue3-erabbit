import request from '@/utils/request'

/**
 * get recommend brand
 * @param {Integer} limit: brand number
 * @returns Promise
 */
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

/**
 * get banner sliders
 * @returns Promise
 */
export const findBanner = () => {
  return request('/home/banner', 'get')
}

/**
 * get new products
 * @returns Promise
 */
export const findNew = () => {
  return request('home/new', 'get')
}

/**
 * get hot products
 * @returns Promise
 */
export const findHot = () => {
  return request('home/hot', 'get')
}

/**
 * get all product
 * @returns Promise
 */
export const findGoods = () => {
  return request('home/goods', 'get')
}

/**
 * get special cate
 * @returns Promise
 */
export const findSpecial = () => {
  return request('home/special', 'get')
}
