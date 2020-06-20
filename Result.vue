<template>
  <div class="wt-result" :style="{zIndex:zIndex}" @click="clickHandle">
    <div class="image"><img :src="imgUrl" /></div>
    <div class="title">{{title}}</div>
    <div class="content">{{content}}</div>
  </div>
</template>
<script>
import { getCurrentInstance, onMounted, computed } from 'vue';
import img403 from './403.svg';
import img404 from './404.svg';
import img500 from './500.svg';
import info from './info.svg';
import warning from './warning.svg';

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
    const imgUrl = computed(() => {
      let url = '';
      if (props.type) {
        switch(props.type) {
          case '403':
            url = img403;
            break;
         case '404':
            url = img404;
            break;
         case '500':
            url = img500;
            break;
         case 'info':
            url = info;
            break;
         case 'warning':
            url = warning;
            break;
          default:
            url = props.image;
        }
      }
      return url;
    })
    return {
      clickHandle,
      imgUrl
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
  .image {
    img {
      max-width: 70%;
    }
  }
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
