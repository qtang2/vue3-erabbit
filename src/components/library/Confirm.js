import { createVNode, render } from 'vue'
import XtxConfrim from './xtx-confirm'

const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)

export default ({ title, text }) => {
  // 1. import component want to render
  // 2. create vitual node using createVNode func
  // 3. prepare container to hold the component
  // 4. render function to render the component
  // 5. destroy the component

  return new Promise((resolve, reject) => {
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    const vn = createVNode(XtxConfrim, { title, text, cancelCallback, submitCallback })
    render(vn, div)
  })
}
