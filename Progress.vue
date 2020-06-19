<template>
  <div class='wt-progress'>
    <svg viewBox="0 0 200 200">
      <defs>
        <linearGradient x1="1" y1="0" x2="0" y2="0" :id="gradient">
            <stop offset="0%" :stop-color="startColor"></stop>
            <stop offset="100%" :stop-color="endColor"></stop>
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="90" :stroke-width="stroke" :stroke="bgColor" fill="none"></circle>
      <circle cx="100"
      stroke-linecap="round"
      :style="{'display': display ? 'block' : 'none'}"
      cy="100" r="90" :stroke-width="ActiveStroke" :stroke="url" fill="none"
      transform="matrix(0,-1,1,0,0,200)"
      :stroke-dasharray = "setDasharray"
      >
      </circle>
  </svg>
  <p>{{showText}}</p>
</div>
</template>
<script>
import { ref, computed } from 'vue';

export default {
  props: {
    stroke: {
      type: String,
      default: () => {
        return '4'
      }
    },
    ActiveStroke: {
      type: String,
      default: () => {
        return '8'
      }
    },
    value: {
      type: String || Number,
      default: () => {
        return 0
      }
    },
    showText: {
      type: String,
      default: () => {
        return ""
      }
    },
    startColor: {
      type: String,
      default: () => {
        return "#1BB5F1"
      }
    },
    endColor: {
      type: String,
      default: () => {
        return "ff6600"
      }
    },
    bgColor: {
      type: String,
      default: () => {
        return "#D1D3D7"
      }
    }
  },
  setup(props) {
    const display = ref(true); // 是否显示进度条
    // 生成唯一值
  const genID=(length)=> {
    return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
  }
  const gradient = genID(16);
  const url = computed(() => {
    return 'url(#' + gradient + ')';
  })
   const setDasharray=computed(()=> {
    if (props.value === 0) {
      display.value = false;
    } else {
      display.value = true;
    }
    return 603 * (props.value / 100) + ' ' + 603;
  })
    // 暴露给模板
    return {
      gradient,
      setDasharray,
      url,
      display
    }
  }
}
</script>
<style lang="less" rel='stylesheet/less' scoped>
    .wt-progress {
        position: relative;
        p {
            position: absolute;
            font-size: 0.8rem;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            text-align: center;
        }
    }
</style>


