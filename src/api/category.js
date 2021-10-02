import request from '@/utils/request'

/**
 * get all category
 * @returns Promise
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}

/**
 *get top category(children is sub cate)
 * @param {String} id -category id
 */
export const findTopCategory = (id) => {
  return request('/category', 'get', { id })
}
