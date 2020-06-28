<template>
  <div class="wt-drop-down">
    <div class="wt-drop-down-box">
      <div
        :class="['drop-down-list', show ? 'active' : '']"
        :style="{color: show ? selectedColor : ''}"
        @click="clickHandle"
      >
        <div :class="['selected', show ? 'active' : '']">{{currentValue}}</div>
      </div>
    </div>
    <div class="wt-drop-down-mask" v-show="show" style="{zIndex:zIndex}">
      <div
        :class="['item', currentIndex == index ? 'active' : '']"
        :style="{color: currentIndex == index ? selectedColor : ''}"
        v-for="(item, index) in data"
        :key="index"
        @click="itemClick(item, index)">
        <p>
          <span>{{item.text || item}}</span>
          <i class="icon-check" v-show="currentIndex == index"></i>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, computed } from "vue";
export default {
 props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    zIndex: {
      type: Number || String,
      default: () => {
        return '102';
      }
    },
    selectedColor: {
      type: String,
      default: () => {
        return '#1BB5F1';
      }
    },
    defaultSelected: {
      type: String,
      default: () => {
        return '';
      }
    },
    'mask-close': {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  setup (props, {emit}) {
    const show = ref(false);
    const currentIndex = ref(0);
    const value = ref(props.defaultSelected);
    const clickHandle = () => {
     show.value = !show.value;
    }
    const itemClick = (item, index) => {
     currentIndex.value = index;
     value.value = item.text || item;
     show.value = false;
     emit('change', item)
    }
    const currentValue = computed(() => {
      props.data.forEach((element, index) => {
        if (value.value === element.text || value.value === element) {
          currentIndex.value = index;
        }
      })
      return value.value || props.data[0].text || props.data[0];
    })
    const close = () => {
      show.value = false;
    }
    // 暴露给模板
    return {
      clickHandle,
      show,
      itemClick,
      currentValue,
      currentIndex,
      close
    };
  }
}
</script>
<style lang="less" scoped>
  .wt-drop-down {
    flex: 1;
    .wt-drop-down-box {
      background: #fff;
      height: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      &::after {
        content: ' ';
        transform: scaleY(0.5);
        border-bottom: 1px solid #ebedf0;
        position: absolute;
        width:100%;
        bottom:0;
      } 
      .drop-down-list {
        flex: 1;
        height:100%;
        line-height: 2rem;
        .selected {
          text-align: center;
          font-size: 0.8rem;
          position: relative;
          &.active {
            &::after {
              border-color: transparent transparent currentColor currentColor;
              transform: rotate(135deg);
              margin-top: 0;
            }
          }
          &::after {
            position: absolute;
            top: 50%;
            margin-left: 4px;
            margin-top: -5px;
            border: 3px solid;
            border-color: transparent transparent #dcdee0 #dcdee0;
            transform: rotate(-45deg);
            opacity: 0.8;
            content: ' ';
          }
        }
      }
    }
    .wt-drop-down-mask {
      position: fixed;
      height:100%;
      width:100%;
      left:0;
      background: rgba(0,0,0,0.4);
      overflow-y: auto;
      .item {
        background: #fff;
        font-size: 0.8rem;
        padding: 0.5rem;
        position: relative;
        &.active {
          color: #1BB5F1;
        }
        p {
          line-height: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            width: calc(100% - 14px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          i {
            min-width: 14px;
            height: 14px;
          }
        }
        &::after {
          content: ' ';
          transform: scaleY(0.5);
          border-bottom: 1px solid #ebedf0;
          position: absolute;
          width:100%;
          bottom: 0;
        }
      }
    }
  }
</style>
