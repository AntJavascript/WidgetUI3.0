
<template>
    <div class='wt-TextField'>
        <input :type="type" :maxlength="max" v-model="val" :placeholder="placeholder" @blur="blur" @change="change" @input="input" @focus="focus"/>
        <i class="icon-close-fill" @click="clearValue" v-if="clear != undefined && val"></i>
    </div>
</template>
<script>
import { ref } from 'vue';

export default {
  props: {
    type: {
      type: String,
      default: () => {
        return 'text';
      }
    },
    max: {
      type: String || Number,
      default: () => {
        return '';
      }
    },
    placeholder: {
      type: String,
      default: () => {
        return '';
      }
    },
    clear: {
      type: String,
      default: () => {
        return undefined;
      }
    }
  },
  setup (props, {emit}) {
    const val = ref('');
    // 失去焦点
    const blur =()=> {
      event.stopPropagation();
      emit('blur', event.target.value);
    }
    // change事件
    const change =()=> {
      event.stopPropagation();
      emit('change', event.target.value);
    }
    // input事件
    const input =()=> {
      event.stopPropagation();
      emit('input', event.target.value);
    }
    // focus事件
    const focus =()=> {
      event.stopPropagation();
      emit('focus', event.target.value);
    }
    // 清理输入内容
    const clearValue =()=> {
      val.value = '';
    }
    // 暴露给模板
    return {
      val,
      blur,
      change,
      input,
      focus,
      clearValue
    };
  }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
    .wt-TextField {
        height: 1.5rem;
        position: relative;
        border: 1px solid #eee;
        display: flex;
        i {
            background: #fff;
            width: 1.5rem;
            line-height: 1.5rem;
            color: #cacaca;
            text-align: center;
        }
        input {
            outline: none;
            -webkit-appearance: none;
            background: #fff;
            border: 0;
            height: 1.5rem;
            width: 100%;
            display: block;
            padding-left: 0.2rem;
            box-sizing: border-box;
            &::-webkit-search-cancel-button{
                display: none;
            }
        }
    }
</style>
