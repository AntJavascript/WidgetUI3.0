<template>
<div class="wt-swipe" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
        <div class="left" :style="{transform: 'translate3d('+ distance +'px, 0px, 0px)'}"><slot name="left"></slot></div>
        <div class="right" :style="{transform: 'translate3d('+ showRight +'px, 0px, 0px)'}">
          <p v-for="(item, index) in swipeRight" :key="index" @click="handle(item, index)" :style="{'background':item.background || '#1BB5F1'}">
            {{item.content}}
          </p>
        </div>
  </div>
</template>
<script>
import { ref, getCurrentInstance } from "vue";
export default {
  props: {
    swipeRight: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  setup (props) {
    const { ctx } = getCurrentInstance();
    let itemWidth = ref(0);
    let defaultStance = ref(0);
    let start = ref(0);
    let move = ref(0);
    let startY = ref(0);
    let moveY = ref(0);
    let distance = ref(0);
    let showRight = ref(0);
    let hisDistance = ref(0);
    
    const html = document.querySelector('html');
    itemWidth.value = html ? ~~window.getComputedStyle(document.querySelector('html')).fontSize.replace('px', '') : 20;
    defaultStance.value = showRight.value = props.swipeRight.length * (4 * itemWidth.value);
    const handle =(item, index)=> {
      typeof item.handle === 'function' && item.handle(item, index);
      showRight.value = defaultStance.value;
      distance.value = 0;
    }
    const touchStart =()=> {
      hisDistance.value = distance.value;
      // 触摸坐标
      start.value = event.touches[0].clientX;
      startY.value = event.touches[0].clientY;
    }
     const touchMove =() =>{
      ctx.$el.firstChild.style.transitionDuration = "0ms";
      ctx.$el.lastChild.style.transitionDuration = "0ms";
      // 滑动时候的坐标
      move.value = event.touches[0].clientX;
      moveY.value = event.touches[0].clientY;
      if (Math.abs(startY.value - moveY.value) > 10) {
        return;
      } else {
        event.preventDefault();
      }
      if (showRight.value === 0 && move.value - start.value < 0) {
        return ;
      }
      if (hisDistance.value === 0 && move.value - start.value >= 0) {
        return ;
      }
      // 滑动距离
      if (move.value - start.value > 0) {
        showRight.value = move.value - start.value;
        distance.value = hisDistance.value + (move.value - start.value);
      } else {
        distance.value = move.value - start.value;
        showRight.value = defaultStance.value + distance.value;
      }
     }
     const touchEnd =()=> {
       ctx.$el.firstChild.style.transitionDuration = "300ms";
       ctx.$el.lastChild.style.transitionDuration = "300ms";
       
      if (move.value - start.value <= -50 || (move.value - start.value > 0 && move.value - start.value < 50)) {
        // 展示全部
        showRight.value = 0;
        distance.value = -defaultStance.value;
      } else if (move.value - start.value >= -50 || (move.value - start.value > -50 && move.value - start.value < 0)) {
        // 隐藏全部
        showRight.value = defaultStance.value;
        distance.value = 0;
      }
     }
     // 显示
     const show = () => {
       showRight.value = 0;
       distance.value = -defaultStance.value;
     }
     // 隐藏
     const hide = () => {
        showRight.value = defaultStance.value;
        distance.value = 0;
     }
    // 暴露给模板
    return {
      touchStart,
      touchMove,
      touchEnd,
      distance,
      showRight,
      handle,
      show,
      hide
    }
  }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
.wt-swipe {
    min-height: 2rem;
    position: relative;
    overflow: hidden;
    .left {
      transition-duration: 300ms;
    }
    .right {
        transition-duration: 300ms;
        display: flex;
        position: absolute;
        height: calc(100% - 1px);
        right: 0;
        top: 0;
      p {
        display: flex;
        width: 4rem;
        font-size: 0.7rem;
        text-align: center;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
      }
    }
}
</style>
