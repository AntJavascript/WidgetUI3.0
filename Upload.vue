<template>
    <div class='wt-upload'>
        <input type="file" v-if="capture != undefined" :capture="capture" :accept="accept" @change="shoiceImg">
        <input type="file" v-else :accept="accept"  @change="shoiceImg">
        <div class="placeholder">
            <i :class="icon"></i>
            <p>{{title}}</p>
        </div>
        <slot></slot>
    </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => {
        return '上传';
      }
    },
    icon: {
      type: String,
      default: () => {
        return 'icon-add';
      }
    },
    capture: {
      type: String,
      default: () => {
        return undefined;
      }
    },
    accept: {
      type: String,
      default: () => {
        return 'image/*';
      }
    }
  },
  setup (props, {emit}) {
    const shoiceImg =()=> {
      event.stopPropagation()
      var file = event.target.files[0];
      emit('change', file);
      event.target.value = '';
    }
    return {
      shoiceImg
    };
  }
};
</script>
<style lang='less' rel='stylesheet/less' scoped>
 .wt-upload {
     position: relative;
     width: 100%;
     height: 100%;
     display: flex;
     align-items: center;
     justify-content: center;
     height: 100%;
     input {
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
     }
     .placeholder {
         position: absolute;
         z-index: 1;
         text-align: center;
         color: #999;
         i {
            font-size: 1.6rem;
         }
         p {
            font-size: 0.8rem;
         }
     }
 }
</style>
