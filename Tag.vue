<template>
  <span :class="['wt-tag', type, stroke ? 'stroke' : '', flag ? 'flag' : '']" :style="styles">{{title}}</span>
</template>
<script>
import { computed } from "vue";
export default {
  props: {
    title: {
      type: String,
      default: () => {
        return "tag";
      }
    },
    type: {
      type: String,
      default: () => {
        return "default";
      }
    },
    color: {
      type: String,
      default: () => {
        return "";
      }
    },
    stroke: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  setup(props) {
    const styles = computed(() => {
      if (props.color && !props.stroke) {
        return {
          backgroundColor: props.color
        };
      } else if (props.stroke && props.color) {
        return {
          color: props.color,
          border: "1px solid " + props.color
        };
      }
    });
    // 暴露给模板
    return {
      styles
    };
  }
};
</script>
<style lang="less" scoped>
.wt-tag {
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  padding: 0.2em 0.5em;
  color: #fff;
  font-size: 10px;
  line-height: normal;
  border-radius: 0.2em;
  &.default {
    background-color: #969799;
  }
  &.info {
    background-color: #1bb5f1;
  }
  &.danger {
    background-color: #ef4f4f;
  }
  &.success {
    background-color: #37bf4f;
  }
  &.warning {
    background-color: #fadb14;
  }
  &.stroke {
    background: transparent;
    &.default {
      border: 1px solid #969799;
      color: #969799;
    }
    &.info {
      border: 1px solid #1bb5f1;
      color: #1bb5f1;
    }
    &.danger {
      border: 1px solid #ef4f4f;
      color: #ef4f4f;
    }
    &.success {
      border: 1px solid #37bf4f;
      color: #37bf4f;
    }
    &.warning {
      border: 1px solid #fadb14;
      color: #fadb14;
    }
  }
}
</style>