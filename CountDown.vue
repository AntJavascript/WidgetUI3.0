<template>
  <span>{{dateData}}</span>
</template>
<script>
import { utils } from './utils';
import { ref } from 'vue';
export default {
  props: {
    date: {
      type: String || Number,
      default: () => {
        return new Date().getTime() + 50000
      }
    }
  },
  setup(props) {
    const dateData = ref(utils.countDown(props.date).text)
    let timer = setInterval(() => {
      const data = utils.countDown(props.date);
      if (data.day <= 0 && data.hour <= 0 && data.minute <= 0 && data.second <= 0) {
         clearInterval(timer)
      }
      dateData.value = data.text;
    }, 1000);
    // 暴露给模板
    return {
      dateData
    }
  }
};
</script>
<style lang="less" scoped>
</style>