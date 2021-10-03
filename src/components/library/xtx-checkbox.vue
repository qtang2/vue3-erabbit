<template>
  <div class="xtx-checkbox" @click="changeChecked">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default"><slot /></span>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
// 父子组件数据双向绑定： v-model ===> :modelValue  + :update:modelValue
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    /**
     * use @vueuse/core
     */
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      const newVal = !checked.value
      checked.value = newVal

      // 复选框本身change 时间
      emit('change', newVal)
    }
    return { checked, changeChecked }

    /**
     * traditional way to implement
     */
    /* const checked = ref(false)

    const changeChecked = () => {
      checked.value = !checked.value
      emit('update:modelValue', checked.value)
    }

    watch(() => props.modelValue, () => {
      checked.value = props.modelValue
    }, { immediate: true })

    return { checked, changeChecked } */
  }

}
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
