<template>
  <!-- home entry: category + ad loop -->
  <div class="home-entry">
    <div class="page-home">
      <div class="container">
        <!-- Left category -->
        <HomeCategory />
        <!-- home banner -->
        <HomeBanner />

        <!-- home new part -->
        <HomeNew />

        <!-- home hot part -->
        <HomeHot />

        <!-- home brand part -->
        <HomeBrand />

        <!-- home product part -->
        <HomeProduct />

        <!-- home product specail -->
        <HomeSpecial />
      </div>
    </div>
  </div>
</template>
<script>
import HomeCategory from './components/home-category'
import HomeBanner from './components/home-banner'
import HomeNew from './components/home-new'
import HomeHot from './components/home-hot'
import HomeBrand from './components/home-brand'
import HomeProduct from './components/home-product'
import HomeSpecial from './components/home-special'
export default {
  name: 'PageHome',
  components: { HomeCategory, HomeBanner, HomeNew, HomeHot, HomeBrand, HomeProduct, HomeSpecial }
}
</script>
<style lang="less">
</style>
