<template>
  <div class="wt-image" :class="centerClass">
    <img ref="imgEl" 
    :src="placeholder" 
    :class="[fit, coverClass]"
    @error="loadError"
    :data-src="src"
    v-if="lazyload"
    />
    <img ref="imgEl" :src="src" :class="[fit, coverClass]" @error="loadError" v-else />
  </div>
</template>
<script>
import { getCurrentInstance, onMounted, ref, computed } from "vue";
export default {
  props: {
    fit: {
      type: String,
      default: () => {
        return "contain";
      }
    },
    src: {
      type: String,
      default: () => {
        return "";
      }
    },
    center: {
      type: String,
      default: () => {
        return undefined;
      }
    },
    errorImg: {
      type: String,
      default: () => {
        return "/img/error-img.png";
      }
    },
    placeholder: {
      type: String,
      default: () => {
        return "/img/error-img.png";
      }
    },
    lazyload: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  setup(props) {
    const { ctx } = getCurrentInstance();
    const coverClass = ref("");
    const imgEl = ref(null);
    const centerClass = computed(() => {
      if (props.center != undefined) {
        if (props.fit === 'cover') {
          return 'cover-center';
        } else {
          return 'center';
        }
      } else {
        return "";
      }
    })
    onMounted(() => {
      const img = new Image();
      let imgWidth = ''; // 图片真实宽度
      let imgHeight = ''; // 图片真实高度
      let componentWidth = ctx.$el.offsetWidth; // 组件宽度
      let componentHeight = ctx.$el.offsetHeight; // 组件高度
      const ratio = componentWidth / componentHeight; // 组件宽高比
      
      img.onload = e => {
        imgWidth = e.target.width;
        imgHeight = e.target.height;
        const imgRatio = imgWidth / imgHeight; // 图片宽高比
        if (props.fit === "cover") {
          if (ratio === imgRatio) {
            coverClass.value = "cover-q";
          } else if (ratio > imgRatio) {
            coverClass.value = "cover-w";
          } else if (ratio < imgRatio) {
            coverClass.value = "cover-h";
          }
        }
      };
      img.src = props.src;
      
      // 懒加载
      if (props.lazyload) {
        const callback = (entries) => {
          entries.forEach(item => {
            if (item.isIntersecting) {
              item.target.src = item.target.dataset.src;
              io.unobserve(item.target)
            }
          });
        }
        const io = new IntersectionObserver(callback)
        io.observe(imgEl.value)
      }
    });
    
    // 图片加载失败
    const loadError = () => {
      imgEl.value.src = props.errorImg;
    }
    return {
      coverClass,
      imgEl,
      centerClass,
      loadError
    };
  }
};
</script>

<style lang="less" scoped>
.wt-image {
  width: 100%;
  height: 100%;
  overflow: hidden;
  &.center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    float: left;
    &.contain {
      max-width: 100%;
      max-height: 100%;
    }
    &.fill {
      width: 100%;
      height: 100%;
    }
    &.fitHeight {
      height: 100%;
    }
    &.fitWidth {
      width: 100%;
    }
    &.cover {
      &.cover-w {
        width: 100%;
      }
      &.cover-h {
        height: 100%;
      }
      &.cover-q {
        height: 100%;
      }
    }
  }
}
</style>
