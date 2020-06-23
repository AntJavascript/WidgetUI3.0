<template>
  <div :class="['wt-step-count', type]">
    <p @click="reduce">-</p>
    <input v-model="val" readonly />
    <p @click="add">+</p>
  </div>
</template>
<script>
import { ref } from 'vue';
export default {
  props: {
    value: {
      type: Number,
      default:() => {
        return 1
      }
    },
    type: {
      type: String,
      default:() => {
        return 'normal'
      }
    },
     max: {
      type: Number,
      default:() => {
        return 100
      }
    }
  },
  setup(props, {emit}) {
    const val = ref(props.value);
    const add = () => {
      if (val.value >= props.max) {
        val.value = props.max;
        return;
      }
      val.value++;
      emit('change', val.value)
    }
    const reduce = () => {
      if (val.value <= 1) {
        val.value = 1;
        return;
      }
      val.value--;
      emit('change', val.value)
    }
    // 暴露给模板
    return {
      val,
      add,
      reduce
    }
  }
}
</script>
<style scoped lang="less" rel="stylesheet/less">
.wt-step-count {
  display: flex;
  border: 1px solid #eee;
  align-items: center;
  width:5.5rem;
  &.radius {
    border-radius: 1.5rem;
  }
  p {
    display: flex;
    width:1.5rem;
    height:1.5rem;
    align-items: center;
    justify-content: center;
  }
  input {
    height:1.5rem;
    border: none;
    -webkit-appearance: none;
    width:2.5rem;
    border: 1px solid #eee;
    align-items: center;
    border-width:0 1px;
    text-align: center;
    outline: none;
  }
}
</style>
