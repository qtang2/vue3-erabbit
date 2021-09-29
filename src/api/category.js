import request from '@/utils/request'

/**
 * get all category
 * @returns Promise
 */
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}
