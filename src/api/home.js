import request from '@/utils/request'

/**
 * get recommend brand
 * @param {Integer} limit: brand number
 * @returns Promise
 */
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}
