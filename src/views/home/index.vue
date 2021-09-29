<template>
  <div class="page-home">
    <!-- home entry: category + ad loop -->
    <div class="home-entry">
      <div class="container">
        <!-- Left category -->
        <HomeCategory />
      </div>
    </div>
  </div>
</template>
<script>
import HomeCategory from './components/home-category'
export default {
  name: 'PageHome',
  components: { HomeCategory }
}
</script>
<style scoped lang="less"></style>
