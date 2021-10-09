<script>
import { provide } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    // son pass value to father component
    const activeName = useVModel(props, 'modelValue', emit)

    provide('activeName', activeName)

    const tabClick = (name, index) => {
      activeName.value = name

      // trigger on-click event then tell father component
      emit('tab-click', { name, index })
    }

    return { activeName, tabClick }
  },
  render () {
    // get slot content
    const panels = this.$slots.default()

    // get dynamically generated and static panels
    const dynamicPanels = []
    panels.forEach(panel => {
      // static panels
      if (panel.type.name === 'XtxTabsPanel') {
        dynamicPanels.push(panel)
      } else {
        // dynamically generated panels
        panel.children.forEach(item => {
          dynamicPanels.push(item)
        })
      }
    })
    // 1. nav part on the top
    // 2. content part
    // onClick={this.tabClick(item.props.name)} this means tabClick will be called immediately
    const nav = <nav>
      {dynamicPanels.map((item, i) => {
        return <a
          onClick={() => this.tabClick(item.props.name, i)}
          class={{ active: this.modelValue === item.props.name }} href="javascript:;">{item.props.label}
        </a>
      })}
    </nav>
    return <div class="xtx-tabs">{[nav, dynamicPanels]}</div>
  }
}
</script>
<style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
