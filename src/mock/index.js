import Mock from 'mockjs'
import qs from 'qs'

Mock.setup({
  timeout: '500-1000'
})

// intercept /my/test
// need three param, match path, request method, return function with data
Mock.mock(/\/my\/test/, 'get', () => {
  // data logic
  const arr = []
  for (let i = 0; i < 5; i++) {
    arr.push(Mock.mock({
      id: '@id',
      name: '@cname'
    }))
  }
  return { msg: '请求测试接口成功', result: arr }
})

Mock.mock(/\/member\/collect/, 'get', config => {
  const queryString = config.url.split('?')[1]
  const queryObj = qs.parse(queryString)
  const items = []
  for (let i = 0; i < queryObj.pageSize; i++) {
    items.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)',
      desc: '@ctitle(4,10)',
      price: '@float(100,200,2,2)',
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }
  return {
    msg: '获取收藏商品成功',
    result: {
      counts: 35,
      pageSize: queryObj.pageSize,
      page: queryObj.pageSize,
      items
    }
  }
})
