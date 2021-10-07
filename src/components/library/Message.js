import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

const div = document.createElement('div')
div.setAttribute('class', 'xtx-message-container')
document.body.appendChild(div)

let timer = null

export default ({ type, text }) => {
  const vnode = createVNode(XtxMessage, { type, text })
  // render the vnode to actual dom container
  render(vnode, div)

  clearTimeout(timer)

  timer = setTimeout(() => {
    // destroy the vnode in dom container
    render(null, div)
  }, 3000)
}
