
<template>
    <div class="wt-tab">
        <div class="tab">
            <ul :class="type">
                <li v-for="(item, index) in dataSource" 
                :key="index"
                @click="handle(item, index)" 
                :class="{active:active == index}"
                :style="{color: active == index ? color : '', borderBottomColor:active == index ? color : ''}"
                >
                    {{item.text}}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import {ref, watchEffect} from 'vue';

export default {
props: {
    dataSource: {
      type: Array,
      default: () => {
        return [];
      }
    },
    currIndex: {
      type: Number || String,
      default: () => {
        return 0;
      }
    },
    type: {
      type: String,
      default: () => {
        return 'default';
      }
    },
    color: {
      type: String,
      default: () => {
        return '#1BB5F1';
      }
    }
  },
  setup (props, {emit}) {
    const active= ref(0);
    const handle =(item, index) =>{
      active.value = index;
      emit('handle', item, index);
    }
    watchEffect(() => {
      active.value = props.currIndex;
    })
    // 暴露给模板
    return {
      active,
      handle
    };
  }
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
 .wt-tab {
     width: 100%;
     .tab {
         background: #fff;
         height: 100%;
         ul {
             display: flex;
             font-size: 0.7rem;
             height: 100%;
             &.default {
                 justify-content: space-around;
             }
             &.full {
                 justify-content: space-between;
                 li {
                     flex: 1;
                     text-align: center;
                     list-style: none;
                 }
             }
             li {
                 height: 2rem;
                 line-height: 2rem;
                 height: 100%;
                 box-sizing: border-box;
                 list-style: none;
                &.active {
                    border-bottom: 2px solid #1BB5F1;
                    height: 100%;
                    color: #1BB5F1;
                }
             }
         }
     }
 }
</style>
