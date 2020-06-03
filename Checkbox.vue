<template>
  <div class="wt-checkbox">
    <ul>
      <li v-for="(item, index) in dataSource" :key="index" @click="handle(item, index)" :style="{flexDirection: reverse ? 'row-reverse' : 'row'}">
        <p :class="{'icon-check acitive': find(item), 'disable': item.disable}" :style="{backgroundColor:find(item) ? selectedColor : '',borderColor:find(item) ? selectedColor : ''}"></p>
        <div class="item-inner" :class="{'disable': item.disable}">
          <div class="title">{{item.title}}</div>
          <div class="subtitle" v-if="item.desc">{{item.desc}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import {reactive} from 'vue'

export default {
  props: {
    dataSource: {
      type: Array,
      default: function() {
        return [];
      }
    },
    reverse: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    selectedColor: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  setup(props, {emit}) {
    const selected = reactive([])
    const handle = item =>{
      if (item.disable) {
        return;
      }
      if (!find(item)) {
        selected.push(item);
      } else {
        const i = find(item, true).index;
        selected.splice(i, 1);
      }
      emit("handle", selected);
    }
    const find =(item, remove) =>{
      let flag = false;
      if (remove) {
        var index;
      }
      for (var i = 0; i < selected.length; i++) {
        if (selected[i] === item) {
          flag = true;
          index = i;
        }
      }
      if (remove) {
        return {
          flag: flag,
          index: index
        };
      } else {
        return flag;
      }
    }
    return {
      selected,
      handle,
      find
    }
  }
};
</script>
<style scoped lang="less" rel="stylesheet/less">
.wt-checkbox {
  ul {
    background: #ffffff;
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
    li {
      box-sizing: border-box;
      position: relative;
      text-align: left;
      // line-height: 2rem;
      // height: 2rem;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      .item-inner {
        width: 100%;
        box-sizing: border-box;
        white-space: nowrap;
        // padding-right: 2rem;
        text-overflow: ellipsis;
        padding-left: 0.4rem;
        word-break:break-all;
        &.disable {
          color:#afaeae;
        }
        &::after {
          transform: scaleY(0.5);
          height: 1px;
          content: "";
          border-bottom: 1px solid #ccc;
          display: block;
        }
        .title {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          overflow: hidden;
          -webkit-box-orient: vertical;
          white-space: normal;
          margin: 0.2rem;
        }
        .subtitle {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          overflow: hidden;
          -webkit-box-orient: vertical;
          white-space: normal;
          color: #999;
          font-size: 0.7rem;
          margin: 0.2rem;
        }
      }
      &::before {
        font-size: 1rem;
        position: absolute;
        right: 8px;
        line-height: 2rem;
        color: #1bb5f1;
        text-align: right;
      }
      p {
        min-width: 1.1rem;
        min-height: 1.1rem;
        width: 1.1rem;
        height: 1.1rem;
        border-radius: 4px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        overflow: hidden;
        align-items: center;
        margin: 0 0.5rem;
        justify-content: center;
        display: flex;
        &.acitive {
          color: #ffffff;
          background: #1bb5f1;
          border: 1px solid #1bb5f1;
        }
        &.disable {
          background: #eee;
        }
      }
    }
  }
}
</style>
