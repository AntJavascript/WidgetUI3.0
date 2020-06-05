<template>
    <div class="wt-cell">
        <div class="cell">
            <slot name="left" v-if="privateSlot.left"></slot>
            <div class="left">
                <div class="title">
                <span v-if="title != ''">{{title}}</span>
            </div>
                <slot name="label" v-if="privateSlot.label"></slot>
                <span class="label" v-if="!privateSlot.label && label != ''">{{label}}</span>
            </div>
            <div class="right">
                <slot name="right" v-if="privateSlot.right"></slot>
                <div v-if="link != undefined" class="icon-right link"></div>
            </div>
        </div>
    </div>
</template>
<script>
import {getCurrentInstance, reactive} from 'vue'
export default {
  props:['title', 'label', 'link'],
  setup(){
  const {ctx} = getCurrentInstance()
    const privateSlot = reactive({});

    if (ctx.$slots.right) {
      privateSlot.right = ctx.$slots.right();
    }
    if (ctx.$slots.left) {
      privateSlot.left = ctx.$slots.left();
    }
    if (ctx.$slots.label) {
      privateSlot.label = ctx.$slots.label();
    }
    return {
      privateSlot
    }
  }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
.wt-cell {
  background: #fff;
  .cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: auto;
    .left {
      flex: 1;
      .title {
        display: flex;
        justify-content: space-between;
        i {
          font-size: 1.2rem;
          margin-right: 0.2rem;
        }
        span {
          font-size: 0.9rem;
          word-break: break-word;
        }
      }
    }
    .right {
      display: flex;
      height: 100%;
      align-items: center;
      .value {
        color: #666;
      }
      .link {
        color: #999;
        margin: 0 0.4rem;
        margin-right: 0;
      }
    }
  }
  .label {
    font-size: 0.75rem;
    color: #666;
    margin: 0.2rem 0;
  }
}
</style>
