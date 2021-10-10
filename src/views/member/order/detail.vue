<template>
  <div class="order-detail-page" v-if="order">
    <DetailAction :order="order" />
    <DetailSteps :order="order" />
    <!-- async component, because setup is async -->
    <Suspense>
      <template #default>
        <DetailLogistics
          v-if="[3, 4, 5].includes(order.orderState)"
          :order="order"
        />
      </template>
      <template #fallback>
        <div class="loading">Loading...</div>
      </template>
    </Suspense>

    <DetailInfo :order="order" />
  </div>
</template>

<script>
import { findOrderDetail } from '@/api/order'
import DetailAction from './components/detail-action.vue'
import DetailSteps from './components/detail-steps.vue'
import DetailLogistics from './components/detail-logistics.vue'
import DetailInfo from './components/detail-info.vue'
import { useRoute } from 'vue-router'
import { ref } from 'vue-demi'
export default {
  name: 'OrderDetailPage',
  components: { DetailAction, DetailSteps, DetailLogistics, DetailInfo },
  setup () {
    const route = useRoute()
    const order = ref(null)
    findOrderDetail(route.params.id).then(data => {
      order.value = data.result
    })

    return { order }
  }

}
</script>
<style scoped lang="less">
.order-detail-page {
  background: #fff;
  height: 100%;
  .loading {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 30px;
    background-color: #f5f5f5;
    margin: 30px 50px 0;
  }
}
</style>
