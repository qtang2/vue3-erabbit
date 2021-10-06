/* eslint-disable no-unused-vars */
<template>
  <div class="xtx-carousel" @mouseenter="stop" @mouseleave="start">
    <ul class="carousel-body">
      <li
        class="carousel-item"
        v-for="(item, i) in sliders"
        :key="i"
        :class="{ fade: index === i }"
      >
        <!-- if sliders is array of images -->
        <RouterLink v-if="item.imgUrl" to="/">
          <img :src="item.imgUrl" alt="" />
        </RouterLink>
        <!-- if sliders is array of goods item -->
        <div v-else class="slider">
          <RouterLink
            v-for="goods in item"
            :key="goods.id"
            :to="`/product/${goods.id}`"
          >
            <img :src="goods.picture" alt="" />
            <p class="name ellipsis">{{ goods.name }}</p>
            <p class="price">&yen;{{ goods.price }}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <!-- previous button -->
    <a @click="toggle(-1)" href="javascript:;" class="carousel-btn prev"
      ><i class="iconfont icon-angle-left"></i
    ></a>
    <!-- next button -->
    <a @click="toggle(1)" href="javascript:;" class="carousel-btn next"
      ><i class="iconfont icon-angle-right"></i
    ></a>
    <!-- indicator -->
    <div class="carousel-indicator">
      <span
        v-for="(item, i) in sliders"
        :key="i"
        :class="{ active: index === i }"
        @click="index = i"
      ></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    sliders: {
      type: Array,
      default: () => []
    },
    // if set automatically play
    autoPlay: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  setup (props) {
    const index = ref(0)

    // 1. autoPlay carousels
    let timer = null
    const autoPlayFn = () => {
      // clear timer before start a new one
      clearInterval(timer)

      timer = setInterval(() => {
        index.value++
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration)
    }

    // need to check sliders has value and autoPlay is true to decide do auto play carousel
    watch(() => props.sliders, (newVal) => {
      if (newVal.length && props.autoPlay) {
        autoPlayFn()
      }
      // though sliders no change, function autoPlay still can run
    }, { immediate: true })

    // 2. mouse enter, pause autoPlay
    const stop = () => {
      if (timer) clearInterval(timer)
    }

    const start = () => {
      if (props.sliders && props.autoPlay) {
        autoPlayFn()
      }
    }

    // 3. click indicator to change banner picture

    // 4. click prev/next button to change picture
    const toggle = (step) => {
      const newIndex = index.value + step

      if (newIndex >= props.sliders.length - 1) {
        index.value = 0
        return
      }
      if (newIndex < 0) {
        index.value = props.length - 1
        return
      }
      index.value = newIndex
    }

    // 5. component destoy, clear timer
    onUnmounted(() => {
      clearInterval(timer)
    })

    return { index, start, stop, toggle }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
}
.slider {
  display: flex;
  justify-content: space-around;
  padding: 0 40px;
  > a {
    width: 240px;
    text-align: center;
    img {
      padding: 20px;
      width: 230px !important;
      height: 230px !important;
    }
    .name {
      font-size: 16px;
      color: #666;
      padding: 0 40px;
    }
    .price {
      font-size: 16px;
      color: @priceColor;
      margin-top: 15px;
    }
  }
}
</style>
