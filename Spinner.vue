<template>
     <i :class='["wt-spinner", "icon-spinner" + type]' :style="{fontSize: size + 'rem',backgroundImage: bgcolor}"></i>
</template>
<script>
import { computed } from 'vue';

export default {
  props: {
    size: {
      type: String,
      default: () => {
        return '1.5';
      }
    },
    type: {
      type: String,
      default: () => {
        return '';
      }
    },
    from: {
      type: String,
      default: () => {
        return '#333';
      }
    },
    to: {
      type: String,
      default: () => {
        return '#999';
      }
    }
  },
  setup(props) {
    const bgcolor = computed(() => {
       return '-webkit-gradient(linear, 0 0, 0 bottom, from(' + props.from + '), to(' + props.to + '))';
    })
    return {
      bgcolor
    }
  }
};
</script>
<style lang='less' rel='stylesheet/less' scoped>
.wt-spinner {
    animation: spin 1.5s infinite steps(8);
    display: inline-block;
    color: #1BB5F1;
    font-size: 1rem;
    background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#333), to(#999));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
@keyframes spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg)
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg)
    }
  }
</style>
