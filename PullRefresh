<template>
    <div class="pullRefresh" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" @scroll="scroll">
    <div class="pullRefresh-wrapper" :style="{transform: 'translate3d(0px, '+ state.distance +'px, 0px)'}">
    <div class="refresh">
      <div v-if="state.status == 'refreshing'" class="refreshing">
        <wt-spinner size="1" type="3" ></wt-spinner>
        <span>{{state.refreshText}}</span>
      </div>
       <div v-else>
         <i :class="state.refreshIcon"></i>
         <span>{{state.refreshText}}</span>
       </div>
      </div>
      <div class="pullRefresh-slide">
        <slot></slot>
      </div>
      <div class="loadmore">
        <div v-if="state.status == 'loadMoreing'" class="loadMoreing">
          <wt-spinner size="1" type="3" ></wt-spinner>
          <span>{{state.loadmoreText}}</span>
        </div>
        <div v-else>
          <i :class="state.loadmoreIcon"></i>
          <span>{{state.loadmoreText}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {reactive, getCurrentInstance} from 'vue'
import Spinner from './Spinner';
export default {
  name: 'wt-pullRefresh',
  components: {
    'wt-spinner': Spinner
  },
props:{
  loadDistance:{
    type:Number,
    default:() => {
      return 100;
     }
  },
 drag:{
    type:Number,
    default:() => {
      return 0.6;
     }
  }
},
setup(props, { emit }){
    const { ctx } = getCurrentInstance()
    const state = reactive({
      refreshText: '下拉可以刷新',
      refreshIcon: 'icon-down',
      loadmoreText: '上拉加载更多',
      loadmoreIcon: 'icon-up',
      distance: 0, // 滑动距离
      start: {X: 0,Y: 0},
      move: {X: 0,Y: 0},
      isDone: false, // 没有数据可加载了
      status: '', // 当前状态
      maxScroll: 0, // 最大可滚动距离
      scrollTop: 0 // 当前滚动距离
})
const touchStart = event => {
      state.scrollTop = ctx.$el.scrollTop;
      const screen  = ctx.$el.offsetHeight; // 可显示区域
      const totalHeight = ctx.$el.firstChild.offsetHeight; // 子元素总高度
  if (screen >= totalHeight ) {
      state.maxScroll = 0;
    } else {
      state.maxScroll = Math.ceil(Math.abs(screen - totalHeight ));
    }
 if (state.scrollTop <= 0 || state.scrollTop >= state.maxScroll) {
      state.start.X = event.touches[0].clientX;
      state.start.Y = event.touches[0].clientY;
    } else {
      state.start.X = 0;
      state.start.Y = 0;
    }
    }
 const touchMove = event => {
    const firstChild = ctx.$el.firstChild;
    firstChild.style.transitionDuration = '0ms';
    // 计算滚动
    state.move.X = event.touches[0].clientX;
    state.move.Y = event.touches[0].clientY;
    // 正在加载
    if (state.status === 'refreshing' || state.status === 'loadMoreing') {
      console.log('正在加载，滑动无效');
      return;
    }
    // 处于顶部的时候向下滑动
    if (state.scrollTop <= 0 && state.start.Y !== 0 && (state.move.Y > state.start.Y)) {
      event.preventDefault();
      state.distance = (state.move.Y - state.start.Y) * props.drag;
      state.refreshText = '释放刷新';
      if (state.distance > 30) {
        state.refreshText = '松开立即刷新';
        state.refreshIcon = 'icon-up';
      } else if (state.distance < 30 && state.distance > 0) {
        state.refreshText = '下拉可以刷新';
        state.refreshIcon = 'icon-down';
      }
    } else if (ctx.$el.scrollTop >= state.maxScroll && state.start.Y !== 0 && (state.move.Y - state.start.Y) < 0) {
       // 处于底部的时候向上滑动
      event.preventDefault();
      if (state.isDone) {
        state.distance = (state.move.Y - state.start.Y) * props.drag;
        return;
      }
      state.distance = (state.move.Y - state.start.Y) * props.drag;
      ctx.$nextTick(() => {
        if (Math.abs(state.distance) > 50) {
          state.loadmoreText = '松开立即加载';
          state.loadmoreIcon = 'icon-down';
        } else {
          state.loadmoreText = '上拉加载更多';
          state.loadmoreIcon = 'icon-up';
        }
      });
    }
  }
const touchEnd = () => {
    const self = state;
    const firstChild = ctx.$el.firstChild;
    firstChild.style.transitionDuration = '300ms';
    if (self.status === 'refreshing' || state.status === 'loadMoreing') {
      return;
    }
    ctx.$nextTick(() => {
      // self.distance >= 0 说明滑动到了顶部
      if (self.distance >= 0 && self.start.Y !== 0 && ctx.$el.scrollTop <= 0) {
        // 顶部滑动距离小于30的话，不会触发刷新
        if (self.distance > 30) {
          self.status = 'refreshing';
          self.refreshText = '正在刷新';
          self.distance = 50;
          emit('refresh');
        } else {
          self.distance = 0;
        }
      } else if (( ctx.$el.scrollTop+ props.loadDistance) >= state.maxScroll) {
        if (self.isDone) {
          self.distance = 0;
        } else {
          if (self.distance < -50) {
            self.distance = -50;
          } else {
            self.distance = 0;
          }
        }
      } else {
        self.distance = 0;
      }
      self.move.Y = 0;
      self.start.Y = 0;
    });
  }
const scroll = () => {
 const screen  = ctx.$el.offsetHeight; // 可显示区域
      const totalHeight = ctx.$el.firstChild.offsetHeight; // 子元素总高度
  if (screen >= totalHeight ) {
      state.maxScroll = 0;
    } else {
      state.maxScroll = Math.ceil(Math.abs(screen - totalHeight ));
    }
     if (state.status === 'loadMoreing') {
      return;
    }
  if (( ctx.$el.scrollTop+ props.loadDistance) >= state.maxScroll) {
    state.status = 'loadMoreing';
    state.loadmoreText = '正在加载';
    emit("load");
  }
 }
const refresh =() => {
    const self = state;
    const firstChild = ctx.$el.firstChild;
    firstChild.style.transitionDuration = '300ms';
    self.distance = 0;
    self.refreshText = '刷新成功';
    self.status = '';
    self.isDone = false;
    self.loadmoreText = '上拉加载更多';
    self.loadmoreIcon = 'icon-up';
  }
  const load = (isDone) => {
    const self = state;
    self.isDone = isDone;
    self.loadmoreText = '加载成功';
    setTimeout(() => {
      self.status = '';
      if (isDone) {
        self.loadmoreText = '沒有数据可加载';
        self.loadmoreIcon = '';
      } else {
        self.loadmoreText = '上拉加载更多';
      }
    }, 300);
  }
return {
state,
touchStart,
touchMove,
touchEnd,
scroll,
refresh,
load
}
},
};
</script>
<style lang='less' scoped>
   .pullRefresh {
      margin: 0 auto;
      position: relative;
      overflow: hidden;
      overflow-y : auto;
      -webkit-overflow-scrolling: touch;
      list-style: none;
      padding: 0;
      height: 100%;
      z-index: 1;
      background:#eee;
      }
      .pullRefresh-wrapper {
        position: relative;
        background: #fff;
        transition-timing-function: ease-out;
        transition-property: transform;
      }
      .refresh {
        position: absolute;
        line-height: 50px;
        bottom: 100%;
        text-align: center;
        width: 100%;
        font-size: 0.7rem;
        .refreshing {
          display: flex;
          align-items: center;
          justify-content: center;
          span {
            margin: 0 0.2rem;
          }
        }
      }
      .loadmore {
        position: absolute;
        line-height: 50px;
        top: 100%;
        text-align: center;
        width: 100%;
        font-size: 0.7rem;
        .loadMoreing {
          display: flex;
          align-items: center;
          justify-content: center;
          span {
            margin: 0 0.2rem;
          }
        }
      }
</style>
