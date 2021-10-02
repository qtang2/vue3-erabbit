<template>
  <div class="top-category">
    <div class="container">
      <!-- bread -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <!-- mode means first out then in -->
        <Transition name="fade-right" mode="out-in">
          <!-- when only change component name, animation wont happen because component didnt change -->
          <!-- so need to add key attri, key change means whole component change, the component will be generate again, so animation will happen -->
          <XtxBreadItem :key="topCategory.id">{{
            topCategory.name
          }}</XtxBreadItem>
        </Transition>
      </XtxBread>

      <!-- banner -->
      <XtxCarousel :sliders="sliders" style="height: 500px" />

      <!-- all categories -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in topCategory.children" :key="item.id">
            <a href="javascript:;">
              <img :src="item.picture" />
              <p>{{ item.name }}</p>
            </a>
          </li>
        </ul>
      </div>

      <!-- sub category recommend products -->
      <div class="ref-goods" v-for="sub in subList" :key="sub.id">
        <div class="head">
          <h3>- {{ sub.name }} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XtxMore :path="`/category/sub/${sub.id}`" />
        </div>
        <div class="body">
          <GoodsItem v-for="item in sub.goods" :key="item.id" :goods="item" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
import xtxBreadItem from '@/components/library/xtx-bread-item.vue'
import GoodsItem from './components/goods-item.vue'
import { findBanner } from '@/api/home'
import { findTopCategory } from '@/api/category'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
  components: { xtxBreadItem, GoodsItem },
  name: 'TopCategory',
  setup () {
    // banner pic
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })

    // bread category
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      let cate = {}
      const item = store.state.category.list.find(item => item.id === route.params.id)
      if (item) cate = item
      return cate
    })

    // get sub cate products
    const subList = ref([])
    const getSubList = () => findTopCategory(route.params.id).then(data => {
      subList.value = data.result.children
    })

    watch(() => route.params.id, (newVal) => {
      // only top category id change need to send request, sub cate not send request
      if (newVal && `/category/${newVal}` === route.path) getSubList()
    }, { immediate: true })

    return { sliders, topCategory, subList }
  }
}
</script>

<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
