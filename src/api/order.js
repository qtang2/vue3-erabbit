import request from '@/utils/request'

/**
 * get order info
 */
export const findCheckoutInfo = () => {
  return request('/member/order/pre', 'get')
}

/**
 * add address
 * @param {Object} address
 */
export const addAddress = (address) => {
  return request('/member/address', 'post', address)
}

/**
 * edit address
 * @param {Object} address
 */
export const editAddress = (address) => {
  return request(`/member/address/${address.id}`, 'put', address)
}

/**
 * submit order
 * @param {Object} order - order info obj
 */
export const submitOrder = (order) => {
  return request('/member/order', 'post', order)
}
