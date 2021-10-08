<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-else>
        <li>
          <span>收<i />货<i />人：</span>{{ showAddress.receiver }}
        </li>
        <li>
          <span>联系方式：</span
          >{{ showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/, "$1****$2") }}
        </li>
        <li>
          <span>收货地址：</span>{{ showAddress.fullLocation.replace(/ /g, "")
          }}{{ showAddress.address }}
        </li>
      </ul>
      <a @click="openAddressEdit(showAddress)" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="openDialog()">切换地址</XtxButton>
      <XtxButton class="btn" @click="openAddressEdit({})">添加地址</XtxButton>
    </div>
  </div>
  <XtxDialog title="切换收货地址" v-model:visible="visibleDialog">
    <div
      @click="selectedAddress = item"
      :class="{ active: selectedAddress && selectedAddress.id === item.id }"
      class="text item"
      v-for="item in list"
      :key="item.id"
    >
      <ul>
        <li>
          <span>收<i />货<i />人：</span>{{ item.receiver }}
        </li>
        <li>
          <span>联系方式：</span
          >{{ item.contact.replace(/^(\d{3})\d{4}(\d{4})/, "$1****$2") }}
        </li>
        <li>
          <span>收货地址：</span
          >{{ item.fullLocation.replace(/ /g, "") + item.address }}
        </li>
      </ul>
    </div>
    <!-- <template v-slot:footer> -->
    <template #footer>
      <XtxButton
        @click="visibleDialog = false"
        type="gray"
        style="margin-right: 20px"
        >取消</XtxButton
      >
      <XtxButton @click="confirmAddressFn" type="primary">确认</XtxButton>
    </template>
  </XtxDialog>

  <!-- address add and edit -->
  <AddressEdit @on-success="successHandler" ref="addressEditCom" />
</template>
<script>
import { ref } from 'vue'
import AddressEdit from './address-edit'
export default {
  name: 'CheckoutAddress',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  components: { AddressEdit },
  // 1. 在拥有根元素的组件中，触发自定义事件，有没有emits选项无所谓
  // 2. 如果你的组件渲染的代码片段，vue3.0规范，需要在emits中申明你所触发的自定义事件
  // 3. 提倡：你发了自定义事件，需要在emits选项申明下，代码可读性很高
  emits: ['change', 'on-success'],
  setup (props, { emit }) {
    // 1. has default address
    // 2. no default, use 1st one
    // no list, ask for add address
    const showAddress = ref(null)

    const defaultAddress = props.list.find(item => item.isDefault === 0)
    if (defaultAddress) {
      showAddress.value = defaultAddress
    } else {
      if (props.list.length) {
        // eslint-disable-next-line vue/no-setup-props-destructure
        showAddress.value = props.list[0]
      }
    }

    emit('change', showAddress.value && showAddress.value.id)

    const visibleDialog = ref(false)

    const selectedAddress = ref(null)

    const confirmAddressFn = () => {
      showAddress.value = selectedAddress.value
      // new grammar, before get id , check if there is value
      emit('change', selectedAddress.value?.id)
      visibleDialog.value = false
    }

    const openDialog = () => {
      selectedAddress.value = null
      visibleDialog.value = true
    }

    // open edit address component
    const addressEditCom = ref(null)
    const openAddressEdit = (address) => {
      addressEditCom.value.open(address)
    }

    const successHandler = (formData) => {
      // find if there is same address id in current list, if no, means add address
      const address = props.list.find(item => formData.id === item.id)
      if (address) {
        // meand update edit address
        for (const key in address) {
          address[key] = formData[key]
        }
      } else {
        // 1. add address
        // eslint-disable-next-line vue/no-mutating-props
        // formData is address, when modify formData, value will be changed everywhere
        // so need to make a copy of formData
        const jsonStr = JSON.stringify(formData)
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(jsonStr))
      }
    }

    return { showAddress, visibleDialog, selectedAddress, confirmAddressFn, openDialog, addressEditCom, openAddressEdit, successHandler }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @xtxColor;
        background: lighten(@xtxColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
  :deep(.body) {
    // add height and overflow in case too many content
    max-height: 500px;
    overflow: auto;
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
