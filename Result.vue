<template>
  <div class="wt-result" :style="{zIndex:zIndex}" @click="clickHandle">
    <div class="image"><img :src="image" /></div>
    <div class="title">{{title}}</div>
    <div class="content">{{content}}</div>
  </div>
</template>
<script>
import { getCurrentInstance, onMounted } from 'vue';

export default {
  props: {
    title: {
      type: String,
      default: () => {
        return 'Result'
      }
    },
    content: {
      type: String,
      default: () => {
        return 'WidgetUI3.0'
      }
    },
    zIndex: {
      type: String,
      default: () => {
        return '101'
      }
    },
    image: {
      type: String,
      default: () => {
        return ''
      }
    },
    type: {
      type: String,
      default: () => {
        return ''
      }
    }
   },
  setup(props, {emit}){
    const {ctx} = getCurrentInstance();
    const clickHandle = () => {
      emit('handle')
    };
    onMounted(() => {
      ctx.$el.addEventListener('touchmove', ()=> {
        event.preventDefault()
      });
    })
    return {
      clickHandle
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.wt-result {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  top: 0;
  left: 0;
  width:100%;
  height:100%;
  background: #fff;
  position: fixed;
  .title {
    white-space: nowrap;
    font-size: 1rem;
    padding: 1rem;
    box-sizing: border-box;
    width:100%;
    text-overflow:ellipsis;
    overflow:hidden;
  }
  .content {
      font-size: 0.8rem;
      color:#999;
      padding: 10px;
      padding-top: 0px;
      word-break: break-all;
    }
}
</style>
