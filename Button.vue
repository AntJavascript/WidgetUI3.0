<template>
  <div class="wt-button" :class="className()" :style="inlineStyle()">{{title}}</div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: () => {
        return "button"
      }
    },
    type: {
      type: String,
      default: () => {
        return "default"
      }
    },
    bgcolor: {
      type: String,
      default: () => {
        return ""
      }
    },
    radius: {
      type: Number,
      default: () => {
        return '0.2'
      }
    },
    width: {
      type: String,
      default: () => {
        return 0
      }
    },
    height: {
      type: String,
      default: () => {
        return 0
      }
    },
    color: {
      type: String,
      default: () => {
        return "#333"
      }
    },
    dashed: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    dashedcolor: {
      type: String,
      default: () => {
        return ""
      }
    }
  },
  setup(props) {
    const className = () => {
      if (props.bgcolor) {
        return props.size;
      }
      return props.type + " " + props.size;
    }
    const inlineStyle = () => {
      let border = ''
      if (props.dashed) {
        border = `1px dashed ${props.dashedcolor}`;
      }
      return {
        background: props.bgcolor,
        color: props.color,
        borderRadius: props.radius + "rem",
        width: props.width ? props.width + "rem" : '',
        height: props.height ? props.height + "rem" : '2rem',
        border: border
      };
    }
    return {
      className,
      inlineStyle
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.wt-button {
  background: #fff;
  color: #333;
  text-align: center;
  border-radius: 0.2rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size:0.8rem;
  &.stroke {
    border: 1px solid #eee;
  }
  &.fill {
    border: none;
  }
  i {
    margin: 0 0.2rem;
  }
  &.default {
    border: 1px solid #eee;
  }
  &.primary {
    background: #1bb5f1;
    color: #fff;
    &:active {
      background: #62c3e9 !important;
    }
  }
  &.danger {
    background: #ef4f4f;
    color: #fff;
    &:active {
      background: #ff6969 !important;
    }
  }
  &.normal {
    height: 2rem;
    line-height: 2rem;
    font-size: 0.8rem;
    width: 50%;
  }
  &.small {
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 0.7rem;
    width: 30%;
  }
  &.large {
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: 0.9rem;
    width: 100%;
  }
}
</style>
