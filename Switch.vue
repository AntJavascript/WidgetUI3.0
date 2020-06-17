<template>
    <div class="wt-switch">
      <label class="label-switch">
        <input type="checkbox" :disabled="disable" @click="Switch" :checked="checked">
        <div :class="{checkbox: true,disabled:disable}" ref="switchRef"></div>
      </label>
    </div>
</template>
<script>
import {ref, watchEffect, onMounted} from 'vue';
export default {
  props: {
    disable: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    },
    checked: {
      type: Boolean,
      default: ()=> {
        return false;
      }
    },
    color: {
      type: String,
      default: ()=> {
        return '#4cd964';
      }
    }
  },
  setup(props, {emit}) {
    const switchRef = ref(null)
    const Switch =()=> {
      emit('switch', event.target.checked);
      if(event.target.checked){
        switchRef.value.style.background = props.color;
      } else {
        switchRef.value.style.background = "#e5e5e5";
      }
    };
    onMounted(() => {
      const stop = watchEffect(() => {
        if(props.checked){
          switchRef.value.style.background = props.color;
        }
      })
      // 清除监听
      stop()
    })
    // 暴露给模板
    return {
      switchRef,
      Switch
    }
  }
};
</script>
<style scoped lang="less" rel="stylesheet/less">
 .wt-switch .label-switch {
    display: block;
    vertical-align: middle;
    width: 2.6rem;
    border-radius: 0.8rem;
    box-sizing: border-box;
    height: 1.7rem;
    position: relative;
    cursor: pointer;
    -ms-flex-item-align: center;
    -webkit-align-self: center;
    align-self: center;
    input[type="checkbox"] {
        position: absolute;
        z-index: 2;
        opacity: 0;
        width: 2.6rem;
        height: 1.7rem;
    }
    input[type="checkbox"]:checked + .checkbox {
        background: #4cd964;
    }
    input[type="checkbox"]:checked + .checkbox:after {
        transform: translateX(1.1rem);
    }
    .checkbox {
        width: 2.6rem;
        border-radius: 0.8rem;
        box-sizing: border-box;
        height: 1.7rem;
        background: #e5e5e5;
        z-index: 0;
        margin: 0;
        padding: 0;
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        appearance: none;
        border: none;
        cursor: pointer;
        position: relative;
        -webkit-transition-duration: 300ms;
        transition-duration: 300ms;
        &.disabled {
         &:after {
           background: #ebe8e8;
         }
        }
        &:before {
            content: ' ';
            position: absolute;
            left: 0.1rem;
            top: 0.1rem;
            width: 2.4rem;
            border-radius: 0.8rem;
            box-sizing: border-box;
            height: 1.4rem;
            z-index: 1;
            -webkit-transition-duration: 300ms;
            transition-duration: 300ms;
            -webkit-transform: scale(1);
            transform: scale(1);
        }
        &:after {
            content: ' ';
            height: 1.4rem;
            width: 1.4rem;
            border-radius: 1.4rem;
            background: #fff;
            position: absolute;
            z-index: 2;
            top: 0.1rem;
            left: 0.1rem;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
            -webkit-transform: translateX(0px);
            transform: translateX(0px);
            -webkit-transition-duration: 300ms;
            transition-duration: 300ms;
        }
    }
}
</style>
