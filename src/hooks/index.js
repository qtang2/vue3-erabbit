/**
 *
 * @param {Object} target - dom obj
 * @param {Function} apiFn - api function
 */
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

export const useLazyData = (apiFn) => {
  const result = ref([])
  const target = ref(null)
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        // console.log('enter intersecting')
        stop()
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    // configuration options, threshold 0 means as long as visual area is intercect with the watched component
    { threshold: 0 }
  )
  return { target, result }
}
// export const useLazyData = (target, apiFn) => {
//   const result = ref([])
//   // stop 是停止观察是否进入或移出可视区域的行为
//   const { stop } = useIntersectionObserver(
//   // target 是观察的目标dom容器，必须是dom容器，而且是vue3.0方式绑定的dom对象
//     target,
//     // isIntersecting 是否进入可视区域，true是进入 false是移出
//     // observerElement 被观察的dom
//     ([{ isIntersecting }], observerElement) => {
//       if (isIntersecting) {
//         console.log('enter intersecting')
//         stop()
//         apiFn().then(data => {
//           result.value = data.result
//         })
//       }
//     }
//   )
//   return result
// }
