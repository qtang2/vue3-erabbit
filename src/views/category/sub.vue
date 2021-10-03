<template>
  <div class="sub-category">
    <div class="container">
      <SubBread />
      <!-- filter head -->
      <SubFilter @filter-change="filterChange" />
      <!-- filter result -->
      <div class="goods-list">
        <!-- sort -->
        <SubSort @sort-change="sortChange" />
        <!-- list -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id">
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <XtxInfiniteLoading
          @infinite="getData"
          :loading="loading"
          :finished="finished"
        />
      </div>
    </div>
  </div>
</template>
<script>
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item'
import XtxInfiniteLoading from '@/components/library/xtx-infinite-loading.vue'
import { ref, watch } from 'vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
export default {
  name: 'SubCategory',
  components: { SubBread, SubFilter, SubSort, GoodsItem, XtxInfiniteLoading },
  setup () {
    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    const route = useRoute()
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const getData = () => {
      loading.value = true
      reqParams.categoryId = route.params.id
      // (no filter contidition) server always give same data, dont panic, not your problem
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          // means there is more data, need to push new val in, not assign value
          goodsList.value.push(...result.items)
          reqParams.page++
        } else {
          finished.value = true
        }
        loading.value = false
      })
    }

    watch(() => route.params.id, (newVal) => {
      if (newVal && route.path === `/category/sub/${newVal}`) {
        finished.value = false
        goodsList.value = []
        // goodsList now empty, so XtxInfiniteLoading component will be moved up, so infinite method will be triggered
        reqParams = {
          page: 1,
          pageSize: 20
        }
      }
    })

    // 1. when change sort condition, send new req
    const sortChange = (sortParams) => {
      finished.value = false
      // combine all filter conditions
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
    }

    // 2. when change filter condition, send new req
    const filterChange = (filterParams) => {
      finished.value = false
      // combine all filter conditions
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
    }

    return { getData, loading, finished, goodsList, sortChange, filterChange }
  }

}
</script>
<style scoped lang="less">
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
