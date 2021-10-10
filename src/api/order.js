import request from '@/utils/request'

/**
 * generate order info based on cart goods
 */
export const findCheckoutInfo = () => {
  return request('/member/order/pre', 'get')
}

/**
 * generate order info based old orders
 */
export const findOrderRepurchase = (id) => {
  return request(`/member/order/repurchase/${id}`, 'get')
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

/**
 * get order detail
 * @param {String} id - order id
 */
export const findOrderDetail = (id) => {
  return request('/member/order/' + id, 'get')
}

/**
 * get order list
 * @param {String} id - order id
 */
export const findOrderList = ({ page = 1, pageSize = 10, orderState = 0 }) => {
  return request('/member/order', 'get', { page, pageSize, orderState })
}
/**
 * cancel order
 * @param {String} orderId - order Id
 * @param {String} cancelReason - reason
 * @returns Promise
 */
export const cancelOrder = (orderId, cancelReason) => {
  return request(`/member/order/${orderId}/cancel`, 'put', { cancelReason })
}

/**
 * delete order
 * @param {Array<string>} ids - order ids
 * @returns
 */
export const deleteOrder = (ids) => {
  return request('/member/order', 'delete', { ids })
}
/**
 * confirm order
 * @param {Array<string>} id - order id
 * @returns
 */
export const confirmOrder = (id) => {
  return request(`/member/order/${id}/receipt`, 'put')
}

/**
 * check order logistics
 * @param {String} id - order id
 * @returns
 */
export const logisticsOrder = (id) => {
  return request(`/member/order/${id}/logistics`, 'get')
}
