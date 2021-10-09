<template>
  <div class="member-order-page">
    <!-- tabs -->
    <XtxTabs v-model="activeName" @tab-click="tabClick">
      <XtxTabsPanel
        v-for="item in orderStatus"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      />
    </XtxTabs>
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <OrderItem
        @on-cancel-order="handleCancel(item)"
        @on-delete-order="handleDelete(item)"
        @on-confirm-order="handleConfirm(item)"
        @on-logistics-order="handleLogistics(item)"
        v-for="item in orderList"
        :key="item.id"
        :order="item"
      />
    </div>
    <XtxPagination
      v-if="total > 0"
      :total="total"
      :current-page="reqParams.page"
      :page-size="reqParams.pageSize"
      @current-change="reqParams.page = $event"
    />
    <!-- cancel order reason -->
    <OrderCancel ref="orderCancelCom" />

    <!-- order logistics -->
    <OrderLogistics ref="orderLogisticsCom" />
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item.vue'
import OrderCancel from './components/order-cancel.vue'
import OrderLogistics from './components/order-logistics.vue'
import { findOrderList, deleteOrder, confirmOrder } from '@/api/order'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
export default {
  name: 'MemberOrderPage',
  components: { OrderItem, OrderCancel, OrderLogistics },
  setup () {
    const activeName = ref('all')

    const loading = ref(false)

    const total = ref(0)

    // get order list
    const orderList = ref([])
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })

    // get order list
    const findOrderListFn = () => {
      loading.value = true
      findOrderList(reqParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }
    // get order list when params change
    watch(reqParams, () => {
      findOrderListFn()
    }, { immediate: true })

    // change tab to change reqParams
    const tabClick = ({ index }) => {
      reqParams.page = 1
      reqParams.orderState = index
    }

    const handleDelete = (item) => {
      const ids = [item.id]
      Confirm({ text: '您确认删除该条订单吗？' }).then(() => {
        deleteOrder(ids).then(() => {
          Message({ text: '删除订单成功', type: 'success' })
          // get latest order list
          findOrderListFn()
        })
      })
    }

    return { activeName, orderStatus, orderList, tabClick, loading, total, reqParams, ...useCancel(), handleDelete, ...useConfirm(), ...useLogistics() }
  }
}

// get logistics
const useLogistics = () => {
  const orderLogisticsCom = ref(null)
  const handleLogistics = (order) => {
    orderLogisticsCom.value.open(order)
  }
  return { handleLogistics, orderLogisticsCom }
}

// cancel order
const useCancel = () => {
  const orderCancelCom = ref(null)
  const handleCancel = (order) => {
    orderCancelCom.value.open(order)
  }
  return { handleCancel, orderCancelCom }
}

// confirm order
const useConfirm = () => {
  const handleConfirm = (item) => {
    Confirm({ text: '您确认收到货吗？确认后货款将会打给卖家。' }).then(() => {
      confirmOrder(item.id).then(() => {
        Message({ text: '确认收货成功', type: 'success' })
        // update order state
        item.orderState = 4
      })
    })
  }

  return { handleConfirm }
}

</script>

<style>
.member-order-page {
  height: 100%;
  background-color: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
  min-height: 400px;
  position: relative;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
