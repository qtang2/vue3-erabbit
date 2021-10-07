import request from '@/utils/request'

/**
 * get goods latest price, stock, isEffective info
 */
export const getNewCartGoods = (skuId) => {
  return request(`/goods/stock/${skuId}`, 'get')
}
