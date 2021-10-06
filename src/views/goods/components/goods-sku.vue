<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            v-if="val.picture"
            :class="{ selected: val.selected, disabled: val.disabled }"
            :src="val.picture"
            :title="val.name"
            alt=""
            @click="changeSku(item, val)"
          />
          <span
            :class="{ selected: val.selected, disabled: val.disabled }"
            @click="changeSku(item, val)"
            v-else
            >{{ val.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerset from '@/vender/power-set'
const spliter = '★'
// get path map
const getPathMap = skus => {
  // 1. get sku set
  // 2. get valid sku data
  // 3. get sub set based on sku using power-set algorithm
  // 4. generate key-value based on sub set
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      const valArr = sku.specs.map(val => val.valueName)
      const valueArrPowerSet = powerset(valArr)
      valueArrPowerSet.forEach(arr => {
        // use start as join char to make key
        const key = arr.join(spliter)
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}

const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })

  return arr
}
const updateDisabledStatus = (specs, pathMap) => {
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      if (val.selected) return
      selectedValues[i] = val.name
      const key = selectedValues.filter(value => value).join(spliter)
      val.disabled = !pathMap[key]
    })
  })
}

const initDefaultSelected = (goods, skuId) => {
  const sku = goods.skus.find(sku => sku.id === skuId)
  if (sku) {
    goods.specs.forEach((item, i) => {
      const val = item.values.find(val => val.name === sku.specs[i].valueName)
      val.selected = true
    })
  }
}

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({ specs: [], skus: [] })
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)

    //
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }

    // update spec button status when initialize
    updateDisabledStatus(props.goods.specs, pathMap)

    // selected or not
    const changeSku = (item, val) => {
      // if disabled,  return
      if (val.disabled) return
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }

      updateDisabledStatus(props.goods.specs, pathMap)

      // inform father about the sku info
      // 1. complete sku combination
      // 2. incomplete sku no need send to father

      const validSelectedValues = getSelectedValues(props.goods.specs).filter(v => v)
      if (validSelectedValues.length === props.goods.specs.length) {
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '').trim()
        })
      } else {
        // let father know if select completed combination
        emit('change', {})
      }
    }

    // update button status when click spec button
    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
