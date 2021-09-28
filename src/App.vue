<template>
  <div class="class">
    APP
    <button @click="fn">test request</button>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  setup () {
    const fn = () => {
      request('/member/profile', 'get', { a: 10 })
    }

    return { fn }
  }
}
</script>

<style lang="less">
</style>
