<template>
  <div :class="['wt-cell', {'border':border != undefined}]">
    <div class="cell">
      <slot name="left" v-if="privateSlot.left"></slot>
      <div class="left">
        <div class="title">
          <span v-if="title != ''">{{title}}</span>
        </div>
        <slot name="label" v-if="privateSlot.label"></slot>
        <span class="label" v-if="label != ''">{{label}}</span>
      </div>
      <div class="right">
        <slot name="right" v-if="privateSlot.right"></slot>
        <div class="value" v-else-if="privateSlot.right == null && right != ''">{{right}}</div>
        <div v-if="link != undefined" class="icon-right link"></div>
      </div>
    </div>
    <slot name="bottom"></slot>
  </div>
</template>
<script>
import { reactive, getCurrentInstance } from "vue";

export default {
  props: {
    title: String,
    label: String,
    right: String,
    left: String,
    link: String,
    border: String
  },
  setup() {
    const { ctx } = getCurrentInstance();
    const privateSlot = reactive({
      right: "",
      left: "",
      label: ""
    });
    if (ctx.$slots.right) {
      privateSlot.right = ctx.$slots.right;
    }
    if (ctx.$slots.left) {
      privateSlot.left = ctx.$slots.left()[0];
    }
    if (ctx.$slots.label) {
      privateSlot.label = ctx.$slots.label;
    }
    return {
      privateSlot
    };
  }
};
</script>
<style lang='less' rel='stylesheet/less' scoped>
.wt-cell {
  background: #fff;
  &.border {
    &:after {
      transform: scaleY(0.5);
      height: 1px;
      content: "";
      display: block;
      border-bottom: 1px solid #ccc;
    }
  }
  .cell {
    // font-size: 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // padding: 0.2rem;
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
          font-size: 0.75rem;
        }
      }
    }
    .right {
      display: flex;
      height: 100%;
      align-items: center;
      .value {
        // font-size: 0.7rem;
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
