<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{
          goods.categories[1].name
        }}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{
          goods.categories[0].name
        }}</XtxBreadItem>
        <XtxBreadItem to="/">{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>
        <div class="spec">
          <GoodsName :goods="goods" />
          <GoodsSku
            :goods="goods"
            skuId="1379052170887827457"
            @change="changeSku"
          />
          <XtxNumbox label="数量" v-model="num" :max="goods.inventory" />
          <XtxButton type="primary" style="margin-top: 20px"
            >加入购物车</XtxButton
          >
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <GoodsHot />
          <GoodsHot :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick, provide } from 'vue'
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image'
import GoodsSales from './components/goods-sales'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs'
import GoodsHot from './components/goods-hot'
import GoodsWarn from './components/goods-warn'
import { useRoute } from 'vue-router'
import { findGoods } from '@/api/product'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku, GoodsTabs, GoodsHot, GoodsWarn },
  setup () {
    const goods = useGoods()

    const changeSku = sku => {
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
    }

    provide('goods', goods)

    const num = ref(1)

    return { goods, changeSku, num }
  }
}
const useGoods = () => {
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    if (newVal && route.path === `/product/${newVal}`) {
      findGoods(route.params.id).then(({ result }) => {
        // in order to re-render other component when goods value change
        // set goods to be empty then other components(which will show only goods has value) will re-generate when goods get value in nextTick
        goods.value = null
        nextTick(() => {
          goods.value = result
        })
      })
    }
  }, { immediate: true })

  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
