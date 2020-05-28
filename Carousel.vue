<template>
  <div class="wt-carousel" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
    <div class="wrapper" :style="{transform: 'translate3d('+ state.distance +'px, 0px, 0px)'}">
      <slot></slot>
    </div>
    <div class="carousel-pagination" v-if="options.pagination">
      <p v-for="(item, index) in state.itemCount" :key="index" :class="{'active':index === state.currentIndex}"></p>
    </div>
  </div>
</template>
<script>
import { reactive, onMounted, getCurrentInstance } from "vue";

export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {
          loop: false,
          pagination: true,
          auto: false,
          time: 3000
        };
      }
    }
  },
  setup(props) {
    const { ctx } = getCurrentInstance();
    const state = reactive({
      itemWidth: 0, // item的宽度
      speed: 1, // 速度
      currentIndex: 0, // 当前处于第几个
      distance: 0, // 滑动距离
      itemCount: 0, // 有多少item
      thisDistance: 0, // 本次滑动距离
      start: { X: 0, Y: 0 }, // 触摸坐标
      move: { X: 0, Y: 0 }, // 移动坐标
      slots: [], // 父组件的slot
      autoPlay: "", // 自动轮播定时器
      status: "" // 当前状态
    });
    // 定时器函数
    const autoPlayFn = () => {
      const firstChild = ctx.$el.firstChild;
      firstChild.style.transitionDuration = "300ms";
      // 循环轮播
      if (props.options.loop) {
        state.currentIndex++;
        // 当前索引大于itemCount ，就返回到第一个
        if (state.currentIndex > state.itemCount) {
          state.currentIndex = 0;
          firstChild.style.transitionDuration = "0ms";
          state.distance = -state.itemWidth;
        } else {
          state.distance = -((state.currentIndex + 1) * state.itemWidth);
          if (state.currentIndex === state.itemCount) {
            state.currentIndex = 0;
            // 400ms之后滚动到第一张，并且过渡时间为0, 时间一定要设置大于300ms，否则会有闪屏问题
            setTimeout(() => {
              firstChild.style.transitionDuration = "0ms";
              state.distance = -state.itemWidth;
            }, 400);
          }
        }
      } else {
        // 不循环轮播
        if (state.currentIndex === state.itemCount - 1) {
          state.currentIndex = 0;
          state.distance = -(state.currentIndex * state.itemWidth);
        } else {
          state.currentIndex++;
          state.distance = -(state.currentIndex * state.itemWidth);
        }
      }
      ctx.$emit("swiper", state.currentIndex);
    };
    onMounted(() => {
      state.itemWidth = ctx.$el.offsetWidth;
      const len = ctx.$el.children[0].children.length;
      // 处理每个item的宽度
      for (let i = 0; i < len; i++) {
        if (ctx.$el.children[0].children[i].className.indexOf('carousel-item') > -1) {
          const elm = ctx.$el.children[0].children[i];
          elm.style.width = state.itemWidth + "px"; // 设置每个item的宽度
          state.slots.push(ctx.$el.children[0].children[i]);
          state.itemCount++;
        }
      }
      // 需要重复轮播
      if (props.options.loop) {
        const firstChild = ctx.$el.firstChild;
        // 克隆第一个item
        const first = state.slots[0].cloneNode(true);
        firstChild.appendChild(first);
        // 克隆最后一个item
        const last = state.slots[state.slots.length - 1].cloneNode(true);
        firstChild.insertBefore(last, firstChild.childNodes[0]);
        firstChild.style.transitionDuration = "0ms";
        state.distance = -state.itemWidth;
      }
      // 是否自动轮播
      if (props.options.auto) {
        state.autoPlay = setInterval(autoPlayFn, props.options.time);
      }
    });
    const touchStart = event => {
      // 关闭定时器
      clearInterval(state.autoPlay);
      // 触摸坐标
      state.start.X = event.touches[0].clientX;
      state.start.Y = event.touches[0].clientY;
    };
    const touchMove = event => {
      state.status = "moveing";
      const firstChild = ctx.$el.firstChild;
      firstChild.style.transitionDuration = "0s";
      // 滑动时候的坐标
      state.move.X = event.touches[0].clientX;
      state.move.Y = event.touches[0].clientY;
      // 如果是横着滑动则阻止浏览器默认行为
      if (
        Math.abs(state.move.Y - state.start.Y) <
        Math.abs(state.move.X - state.start.X)
      ) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        // 如果是竖着滑动，则 return
        return;
      }
      // 本次滑动距离
      const thisDistance = state.move.X - state.start.X;
      state.thisDistance = thisDistance;
      // 如果是循环轮播，则是currentIndex + 1
      let resistance = 1;
      if (
        (thisDistance > 0 && state.currentIndex === 0) ||
        (thisDistance < 0 && state.currentIndex === state.itemCount - 1)
      ) {
        resistance = 0.2;
      }
      if (props.options.loop) {
        state.distance =
          -((state.currentIndex + 1) * state.itemWidth) +
          thisDistance * resistance;
      } else {
        state.distance =
          -(state.currentIndex * state.itemWidth) + thisDistance * resistance;
      }
    };
    const isLoop = () => {
      if (props.options.loop) {
        state.distance = -(state.itemWidth * (state.currentIndex + 1));
      } else {
        state.distance = -(state.itemWidth * state.currentIndex);
      }
    };
    const touchEnd = () => {
      const firstChild = ctx.$el.firstChild;
      // 重新开启定时器
      if (props.options.auto) {
        state.autoPlay = setInterval(autoPlayFn, props.options.time);
      }
      // 如果是竖着滑动，则 return
      if (
        Math.abs(state.move.Y - state.start.Y) >
        Math.abs(state.move.X - state.start.X)
      ) {
        return;
      }
      // 如果state.move.X === 0说明没有移动
      if (state.status === "") {
        return;
      }
      firstChild.style.transitionDuration = "300ms";
      // 往左滑
      if (state.thisDistance < 0) {
        if (state.thisDistance <= -(state.itemWidth / 3)) {
          // 当前index 必须小于item数量减1
          if (state.currentIndex < state.itemCount - 1) {
            state.currentIndex++;
          } else {
            if (props.options.loop && state.currentIndex < state.itemCount) {
              state.currentIndex++;
            }
          }
          ctx.$emit("swiper", state.currentIndex);
          isLoop();
        } else {
          isLoop();
        }
        // 如果是无限循环，则需要把索引变成0
        if (props.options.loop) {
          if (state.itemCount === state.currentIndex) {
            state.currentIndex = 0;
            setTimeout(() => {
              firstChild.style.transitionDuration = "0s";
              state.distance = -state.itemWidth;
            }, 300);
          }
        }
      } else {
        // 往右滑
        if (state.thisDistance >= state.itemWidth / 3) {
          // 当前index 必须小于item数量减1
          state.currentIndex--;
          if (!props.options.loop && state.currentIndex <= 0) {
            state.currentIndex = 0;
          }
          ctx.$emit("swiper", state.currentIndex);
          isLoop();
        } else {
          isLoop();
        }
        // 如果是无限循环，则需要把索引变成最后一个
        if (props.options.loop) {
          if (state.currentIndex < 0) {
            state.currentIndex = state.itemCount - 1;
            ctx.$emit("swiper", state.currentIndex);
            setTimeout(() => {
              firstChild.style.transitionDuration = "0s";
              state.distance = -(state.itemWidth * (state.currentIndex + 1));
            }, 300);
          }
        }
      }
      state.start.X = 0;
      state.move.X = 0;
      state.status = "";
    };
    return {
      state,
      touchStart,
      touchMove,
      touchEnd
    };
  }
};
</script>
<style lang="less" rel="stylesheet/less" scoped>
.wt-carousel {
  width: 100%;
  // height: 10rem;
  position: relative;
  overflow: hidden;
  .wrapper {
    width: 100%;
    height: 100%;
    display: -webkit-box;
    transition-duration: 300ms;
    transition-timing-function: ease-out;
    transition-property: transform;
    .carousel-item {
      text-align: center;
      font-size: 0.8rem;
      height: 100%;
      width: 100%;
      background: #fff;
    }
    img {
      height: 100%;
      width: 100%;
      float: left;
    }
  }
  .carousel-pagination {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: 0.3rem;
    width: 100%;
    p {
      margin: 0.2rem;
      height: 0.3rem;
      width: 0.3rem;
      border-radius: 0.3rem;
      background: #000;
      opacity: 0.4;
      &.active {
        background: #40cfa0;
        opacity: 1;
      }
    }
  }
}
</style>
