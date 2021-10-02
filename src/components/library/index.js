// add plugins to vue
// like global component, customized v-, add method to Vue
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'
import defaultImg from '@/assets/images/200.png'

// require params：1. 目录  2. 是否加载子目录  3. 加载的正则匹配/string
const importFn = require.context('./', false, /\.vue$/)

export default {
  install (app) {
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)

    // import all components automatically
    importFn.keys().forEach(key => {
      const component = importFn(key).default
      app.component(component.name, component)
    })

    defineDirective(app)
  }
}

// define directive
const defineDirective = (app) => {
  // picture lazy load directive
  app.directive('lazy', {
    // el- the dom ele using this directive, binding- obj that receive directive value
    mounted (el, binding) {
      // create an observer to observe current dom
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // enter visual area, stop observing
          observer.unobserve(el)

          // if ele load failed
          el.onerror = () => {
            el.src = defaultImg
          }
          // set ele.src as passed param(which is the image url)
          el.src = binding.value
        }
      }, { threshold: 0 })
      // observe the element using this directive
      observer.observe(el)
    }
  })
}
