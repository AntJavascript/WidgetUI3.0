<template>
  <div class="wt-card" :style="{borderRadius: radius, padding: padding, margin: margin}">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    radius: {
      type: String,
      default: () => {
        return '0.3rem'
      }
    },
    padding: {
      type: String,
      default: () => {
        return '0.4rem'
      }
    },
    margin: {
      type: String,
      default: () => {
        return '0.4rem'
      }
    },
  }
}
</script>
<style lang="less" scoped>
.wt-card {
  margin: 0.4rem;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 0 0.2rem #ccc;
  border-bottom: 0.1rem solid #ccc;
}
</style>