<template>
    <div id="wt-model" :style="{background:'rgba(0,0,0,'+ opacity +')', 'z-index': zIndex}">
        <slot></slot>
    </div>
</template>
<script>
export default {
  name: 'wt-model',
  props: {
    opacity: {
      type: String,
      default: () => {
        return '0.3';
      }
    },
    zIndex: {
      type: String,
      default: () => {
        return '102';
      }
    }
  }
};
</script>
<style lang='less' rel="stylesheet/less" scoped>
#wt-model {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
</style>