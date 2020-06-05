<template>
<div class="box-picker">
    <div class="picker isAndroid" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
        <div class="picker-wrapper" :style="{transform: 'translate3d(0px, '+ state.distance +'px, 0px)'}">
            <div class="picker-item" @click="onClick(index)" v-for="(item, index) in dataSource" :key="index" :class="{'active': state.currentIndex === index}">
                {{ showFiled(item) }}
            </div>
        </div>
    </div>
</div>
</template>
<script>
import {reactive, getCurrentInstance} from 'vue'
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => {
        return [];
      }
    },
    filed: {
      type: String,
      default: () => {
        return 'text';
      }
    }
  },
  setup(props,  { emit }) {
   const { ctx } = getCurrentInstance()
    const state = reactive({
      activeIndex: 0,
      itemWidth: '',
      speed: 2, // 速度
      translate: 0, // 滑动距离
      isTop: true, // 是否滑动到了顶部
      isBottom: false, // 是否滑动到了底部
      distance: 0, // 滑动距离
      hisdistance: 0, // 上一次滑动距离
      maxDistance: '', // 最大滑动距离
      start: {X: 0,Y: 0 },
      move: {X: 0,Y: 0 },
      status: '', // 当前状态
      startTime: '', // 触摸时间
      currentIndex: 0 // 当前处于第几个
    });
    // 获取html的fontsize
    state.itemWidth = ~~window.getComputedStyle(document.querySelector('html')).fontSize.replace('px', '');
    state.maxDistance = (state.itemWidth * 2) * (props.dataSource.length - 1);
    const  showFiled = item => {
      if (props.filed !== '') {
        return item[props.filed];
      } else {
        return item;
      }
    }
   const  touchStart  = () => {
      // 触摸坐标
      state.start.X = event.touches[0].clientX;
      state.start.Y = event.touches[0].clientY;
      state.startTime = new Date().getTime();
      state.maxDistance = (state.itemWidth * 2) * (props.dataSource.length - 1);
    }
const touchMove  = () => {
      event.preventDefault();
      // 滑动时候的坐标
      state.move.X = event.touches[0].clientX;
      state.move.Y = event.touches[0].clientY;
      // 滑动距离
      const tance = state.move.Y - state.start.Y; // 本次滑动距离
     if(state.move.Y - state.start.Y > 0 && state.currentIndex === 0) {
        state.distance = 0;
         state.currentIndex = 0;
      } else {
          state.distance = state.hisdistance + tance; // 页面滑动距离(上一次滑动距离 + 本次滑动距离)
      }
    };
const  touchEnd = () => {
      const endTime = new Date().getTime()
      if (endTime - state.startTime > 300) {
        state.speed = 1;
      }
      if (state.move.Y === 0) {
        return;
      }
      // state.distance >= 0 说明滑动到了顶部
      if (state.distance >= 0) {
        // 顶部滑动距离小于30的话，不会触发刷新
        if (state.distance > 30) {
          state.distance = 0;
          state.hisdistance = 0; // 清除上一次滑动距离
        } else {
          state.distance = 0;
          state.hisdistance = 0; // 清除上一次滑动距离
        }
        state.currentIndex = 0;
        state.isTop = true; // 滑动到了顶部
        state.isBottom = false;
      } else if (Math.abs(state.distance) >= (state.maxDistance)) {
        state.isBottom = true;
        state.isTop = false;
        // 当前处于第几个 item
        state.currentIndex = Math.abs(Math.round((state.maxDistance / (state.itemWidth * 2)) * state.speed));
      } else if (Math.abs(state.distance) >= state.maxDistance && Math.abs(state.distance) < (state.maxDistance)) {
        state.isBottom = true;
        state.isTop = true;
        state.currentIndex = Math.abs((Math.round(state.maxDistance / (state.itemWidth * 2)) * state.speed));
      } else {
        state.isTop = false;
        state.isBottom = false;
        // 当前处于第几个 item
        if (state.move.Y - state.start.Y > 0) {
          // 往下滑
             state.currentIndex = Math.abs(Math.round((Math.abs(state.hisdistance) - Math.abs(state.move.Y - state.start.Y)* state.speed) / (state.itemWidth * 2)));
        } else {
           // 往上滑
          state.currentIndex = state.currentIndex + Math.abs(Math.round(((state.distance - state.hisdistance) * state.speed)  / (state.itemWidth * 2)));
        }
      }
      state.move.Y = 0;
      // 滑动距离
      let tance = -state.currentIndex * (state.itemWidth * 2);
      // 不能超过最大滑动距离
      if( Math.abs(tance ) >= state.maxDistance) {
          tance = -state.maxDistance
      }
      // 最大item 
      if(state.currentIndex >= props.dataSource.length) {
        state.currentIndex = props.dataSource.length - 1
      }
     state.distance = state.hisdistance = tance;
      emit('change', props.dataSource[state.currentIndex], state.currentIndex);
    };
// 重置
   const rest = () => {
      ctx.$nextTick(() => {
        state.distance = 0;
        state.currentIndex = 0;
        state.maxDistance = (state.itemWidth * 2) * (props.dataSource.length - 1);
        state.hisdistance = 0;
      });
    }
// 点击item
const onClick = index =>{
    state.currentIndex = index;
    state.distance = -index * (state.itemWidth * 2);
    state.hisdistance =  state.distance;
    if(index === 0) {
      state.isTop = true;
      state.isBottom = false;
     } else if(props.dataSource.length - 1=== index) {
         state.isTop = false;
         state.isBottom = true;
     } else {
         state.isTop = false;
         state.isBottom = false;
     }
    emit('change', props.dataSource[state.currentIndex], state.currentIndex);
}
// 获取当前位置以及值
const getCurrentIndex =() =>{
  return {
    data:props.dataSource[state.currentIndex],
    index:state.currentIndex
  }
}
// 滚动到指定位置
const scrollTo = (index) => {
  // 不能小于最小值
  if(isNaN(index) || index < 0 ) {
     index = 0;
  } else if(index > props.dataSource.length) {
  // 最大值
    index = props.dataSource.length - 1
  }
  state.move.Y = 0;
  state.distance = hisdistance = -index * (state.itemWidth * 2);
  state.currentIndex = index;
}
  return {
      state,
      touchStart,
      touchMove ,
      touchEnd,
      rest,
      onClick,
      showFiled
    }
  },
};
</script>
<style lang='less' rel='stylesheet/less' scoped>
.box-picker{
  flex:1; 
  background: #fff;
}
.picker {
    display: flex;
    height: 10rem;
    position: relative;
    overflow: hidden;
    flex: 1;
    &::after {
      content: '';
      background: #f4f4f4;
      height: 2rem;
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);
      border-bottom: 1px solid #e0dddd;
      border-top: 1px solid #e0dddd;
      box-sizing: border-box;
      z-index: 1;
  }
&.isAndroid {
     .picker-wrapper {
      width: 100%;
      position: relative;
      top: calc(50% - 1rem);
      z-index: 2;
      height:2rem;
      line-height: 2rem;
      .picker-item {
          white-space: nowrap;
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          color: #8b8b8b;
          font-size: 0.8rem;
          height: 100%;
          width:100%;
          &.active {
              color: #333;
          }
      }
  }
}
  .picker-wrapper {
      width: 100%;
      position: relative;
      top: calc(50% - 1rem);
      z-index: 2;
      transition-duration:300ms;
      .picker-item {
          white-space: nowrap;
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
          color: #8b8b8b;
          font-size: 0.8rem;
          line-height: 2rem;
          &.active {
              color: #333;
          }
      }
  }
}
</style>
