<template>
  <div class="detail-logistics">
    <p>
      <span>{{ list[0].time }}</span>
      <span>{{ list[0].text }}</span>
    </p>
    <a @click="handleLogistics(order)" href="javascript:;">查看物流</a>
    <!-- order logistics -->
    <Teleport to="#model">
      <OrderLogistics ref="orderLogisticsCom" />
    </Teleport>
  </div>
</template>
<script>
import { logisticsOrder } from '@/api/order'
import { ref } from 'vue-demi'
import { useLogistics } from '../index.vue'
import OrderLogistics from './order-logistics.vue'
export default {
  name: 'DetailLogistics',
  components: { OrderLogistics },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  // if setup use async, this component is an async components, need to wrap with Suspense when use this component
  // Notice: setup must run when component is instanced, so if it is async, need special treate(Suspense) when use this  component
  async setup (props) {
    const data = await logisticsOrder(props.order.id)
    const list = ref(data.result.list)
    return { data, list, ...useLogistics() }
  }
}
</script>
<style scoped lang="less">
.detail-logistics {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
  > p {
    flex: 1;
    span {
      color: #999;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  > a {
    color: @xtxColor;
    text-align: center;
  }
}
</style>
