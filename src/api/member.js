import request from '@/utils/request'

/**
 * get collect info
 * @param {Integer} collectType - 1为商品，2为专题，3为品牌
 * @returns
 */
export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'get', { page, pageSize, collectType })
}

/**
 * get browse history info
 * @param {Integer} collectType - 1为商品，2为专题，3为品牌
 * @returns
 */
export const findBrowseHistory = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'get', { page, pageSize, collectType })
}
