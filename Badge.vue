<template>
  <div
    class="wt-badge"
    :class="type"
    :style="{background: bgcolor, color: textcolor, padding: padding + 'rem', borderRadius: radius + 'rem'}"
  >{{title}}</div>
</template>
<script lang="ts">
export default {
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    type: {
      type: String,
      default: () => {
        return 'default'
      }
    },
    bgcolor: {
      type: String,
      default: () => {
        return ''
      }
    },
    color: {
      type: String,
      default: () => {
        return '#fff'
      }
    },
    padding: {
      type: String,
      default: () => {
        return '0.3'
      }
    },
    radius: {
      type: String,
      default: () => {
        return '0.5'
      }
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.wt-badge {
  padding: 0.3rem;
  display: inline-block;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 0.6rem;
  min-width: 0.6rem;
  min-height: 0.6rem;
  box-sizing: border-box;
  line-height: 0.4rem;
  text-align: center;
  &.default {
    background: #ef4f4f;
  }
  &.primary {
    background: #1bb5f1;
  }
}
</style>