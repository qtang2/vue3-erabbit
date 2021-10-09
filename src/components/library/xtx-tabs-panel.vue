<template>
  <!-- 装载是内容 -->
  <div class="xtx-tabs-panel" v-show="name === activeName">
    <slot />
  </div>
</template>
<script>
import { inject } from 'vue'
export default {
  name: 'XtxTabsPanel',
  setup () {
    const activeName = inject('activeName')

    return { activeName }
  },
  // label is the tile, name is the unique id
  props: {
    label: {
      type: String,
      default: ''
    },
    name: {
      type: [Number, String],
      default: ''
    }
  }
}
</script>
