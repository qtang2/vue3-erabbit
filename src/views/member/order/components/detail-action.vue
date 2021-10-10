<template>
  <div class="detail-action" v-if="order">
    <div class="state">
      <span
        class="iconfont"
        :class="[`icon-order-${orderStatus[order.orderState].name}`]"
      ></span>
      <p>{{ orderStatus[order.orderState].label }}</p>
    </div>
    <div class="info">
      <p>订单编号：{{ order.id }}</p>
      <p>下单时间：{{ order.createTime }}</p>
    </div>
    <div class="btn">
      <template v-if="order.orderState === 1">
        <XtxButton
          @click="$router.push('/member/pay?id=' + order.id)"
          type="primary"
          size="small"
          >立即付款</XtxButton
        >
        <XtxButton @click="handleCancel(order)" type="gray" size="small"
          >取消订单</XtxButton
        >
      </template>

      <XtxButton
        @click="handleConfirm(order)"
        v-if="order.orderState === 3"
        type="primary"
        size="small"
        >确认收货</XtxButton
      >

      <XtxButton v-if="order.orderState === 4" type="plain" size="small"
        >评价商品</XtxButton
      >

      <XtxButton v-if="order.orderState === 5" type="plain" size="small"
        >查看评价</XtxButton
      >

      <XtxButton
        @click="$router.push(`/member/checkout?orderId=${order.id}`)"
        v-if="order.orderState === 2"
        type="primary"
        size="small"
        >再次购买</XtxButton
      >

      <XtxButton
        v-if="[3, 4, 5].includes(order.orderState)"
        type="plain"
        size="small"
        @click="$router.push(`/member/checkout?orderId=${order.id}`)"
        >再次购买</XtxButton
      >
      <XtxButton
        v-if="[4, 5].includes(order.orderState)"
        type="gray"
        size="small"
        >申请售后</XtxButton
      >
    </div>
    <Teleport to="#model">
      <OrderCancel ref="orderCancelCom" />
    </Teleport>
  </div>
</template>
<script>
import { orderStatus } from '@/api/constants'
import OrderCancel from './order-cancel.vue'
import { useCancel, useConfirm } from '../index.vue'

export default {
  name: 'OrderDetailAction',
  components: { OrderCancel },
  props: {
    order: {
      type: Object,
      default: () => { }
    }
  },
  setup () {
    return { orderStatus, ...useCancel(), ...useConfirm() }
  }
}
</script>
<style scoped lang="less">
.detail-action {
  height: 180px;
  width: 100%;
  display: flex;
  align-items: center;
  .state {
    width: 220px;
    text-align: center;
    .iconfont {
      font-size: 40px;
      color: @xtxColor;
    }
    p {
      font-size: 16px;
      color: #666;
      margin-bottom: 10px;
    }
  }
  .info {
    width: 240px;
    line-height: 30px;
    p {
      color: #999;
    }
  }
  .btn {
    flex: 1;
    text-align: right;
    margin-right: 100px;
    .xtx-button {
      margin-left: 20px;
    }
  }
}
</style>
